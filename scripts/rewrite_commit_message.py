#!/usr/bin/env python3
"""
git filter-branch --msg-filter helper.

Reads the existing commit message from stdin, and writes a cleaned/rebuilt message
to stdout. We:
- remove any 'Made-with:' trailer lines (case-insensitive)
- if the subject is empty, generate a conventional commit style subject based on
  files touched by the commit (via git diff-tree on GIT_COMMIT).

This script intentionally does NOT mention or add any banned footer/trailer.
"""

from __future__ import annotations

import os
import re
import subprocess
import sys
from typing import List, Tuple


def sh(args: List[str]) -> str:
    return subprocess.check_output(args, text=True, errors="replace")


def get_changes(commit: str) -> List[Tuple[str, str]]:
    out = sh(["git", "diff-tree", "--no-commit-id", "--name-status", "-r", commit])
    changes: List[Tuple[str, str]] = []
    for ln in out.splitlines():
        if not ln.strip():
            continue
        parts = ln.split("\t")
        st = parts[0].strip()
        path = parts[-1].strip()
        if path:
            changes.append((st, path))
    return changes


def pick_type_scope(paths: List[str]) -> Tuple[str, str | None]:
    s = set(paths)

    def anyp(prefix: str) -> bool:
        return any(p.startswith(prefix) for p in s)

    def anyf(name: str) -> bool:
        return name in s

    ctype = "chore"
    scope: str | None = None

    if anyp("mobile/") and not anyp("backend/"):
        ctype, scope = "feat", "mobile"
    elif anyp("backend/") and not anyp("mobile/"):
        ctype, scope = "feat", "backend"
    elif anyp(".github/workflows/"):
        ctype, scope = "chore", "ci"
    elif anyp("docs/") or anyf("README.md") or any(p.endswith("GETTING_STARTED.md") for p in s):
        ctype, scope = "docs", None

    # nudge type if filenames strongly suggest it
    low = " ".join(paths).lower()
    if "perf" in low:
        ctype = "perf"
    elif "fix" in low and ctype != "docs":
        ctype = "fix"

    return ctype, scope


def representative_path(paths: List[str]) -> str | None:
    preferred = [
        "backend/cmd/api/main.go",
        "backend/internal/auth/auth.go",
        "backend/internal/middleware/",
        "backend/internal/db/",
        "mobile/src/screens/WelcomeScreen.tsx",
        "mobile/src/screens/AuthScreen.tsx",
        "mobile/src/services/api.ts",
        "docker-compose.yml",
        "README.md",
    ]
    for cand in preferred:
        if cand.endswith("/"):
            for p in paths:
                if p.startswith(cand):
                    return p
        else:
            if cand in paths:
                return cand
    return paths[0] if paths else None


def subject_from_paths(ctype: str, scope: str | None, paths: List[str], changes: List[Tuple[str, str]]) -> str:
    rep = representative_path(paths)

    adds = [p for st, p in changes if st.startswith("A")]
    dels = [p for st, p in changes if st.startswith("D")]
    mods = [p for st, p in changes if st.startswith("M")]

    phrase = "update project"
    if rep == "mobile/src/screens/WelcomeScreen.tsx":
        ctype, scope = "feat", "mobile"
        phrase = "refine welcome loading animation"
    elif rep == "mobile/src/screens/AuthScreen.tsx":
        ctype, scope = "feat", "mobile"
        phrase = "polish auth screen UX"
    elif rep == "mobile/src/services/api.ts":
        if ctype == "feat":
            ctype = "fix"
        scope = "mobile"
        phrase = "adjust API auth handling"
    elif rep == "backend/cmd/api/main.go":
        ctype, scope = "feat", "backend"
        phrase = "harden API server setup"
    elif rep == "backend/internal/middleware/ratelimit.go":
        ctype, scope = "feat", "backend"
        phrase = "add rate limiting middleware"
    elif rep == "docker-compose.yml":
        ctype, scope = "chore", "docker"
        phrase = "update dev compose config"
    elif rep:
        base = rep.split("/")[-1]
        if adds and not mods and not dels:
            phrase = f"add {base}"
        elif dels and not adds and not mods:
            phrase = f"remove {base}"
        else:
            phrase = f"update {base}"

    if scope:
        return f"{ctype}({scope}): {phrase}"
    return f"{ctype}: {phrase}"


def clean_message(raw: str) -> List[str]:
    lines = raw.splitlines()
    out = [ln for ln in lines if not re.match(r"^Made-with:\s*", ln, flags=re.I)]
    # trim trailing empty lines
    while out and out[-1].strip() == "":
        out.pop()
    return out


def first_nonempty(lines: List[str]) -> str:
    for ln in lines:
        if ln.strip():
            return ln.strip()
    return ""


def main() -> int:
    commit = os.environ.get("GIT_COMMIT", "")
    raw = sys.stdin.read()
    cleaned_lines = clean_message(raw)

    subj = first_nonempty(cleaned_lines[:1]) if cleaned_lines else ""
    if not subj:
        changes = get_changes(commit) if commit else []
        paths = [p for _, p in changes]
        ctype, scope = pick_type_scope(paths)
        subj = subject_from_paths(ctype, scope, paths, changes)

        body: List[str] = []
        if changes:
            body.append("")
            body.append("Changes:")
            for st, p in changes[:8]:
                body.append(f"- {st} {p}")
            if len(changes) > 8:
                body.append(f"- ... +{len(changes)-8} more")
        cleaned_lines = [subj] + body
    else:
        # keep existing cleaned message (subject + body) if subject present
        cleaned_lines = cleaned_lines if cleaned_lines else [subj]

    # Final safety: never output empty
    msg = "\n".join(cleaned_lines).rstrip() + "\n"
    sys.stdout.write(msg)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

