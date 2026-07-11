#!/usr/bin/env bash
# Assembles the whole sprint site into _site/:
#   _site/index.html      <- gallery (generated from .site/gallery-template.html)
#   _site/<project>/      <- each top-level project folder
#
# Per project:
#   - package.json with a "build" script -> npm ci && BASE_PATH=<base><dir>/ npm run build,
#     then the first of dist/ build/ out/ _site/ is taken as output
#   - otherwise, if index.html exists    -> folder copied as-is
#   - otherwise                          -> skipped (placeholder folders are fine)
# A failing project is SKIPPED with a warning; it never blocks the others.
#
# Optional per-project metadata for the gallery card: <project>/project.json
#   { "name": "...", "emoji": "..", "description": "...", "status": "live|wip" }
set -uo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/_site"
BASE="${SITE_BASE:-/}"

rm -rf "$OUT"
mkdir -p "$OUT"
CARDS=""

# "my-cool-project" -> "My Cool Project" (fallback when no project.json)
prettify() {
  printf '%s' "$1" | tr '-' ' ' | awk '{for (i=1; i<=NF; i++) $i = toupper(substr($i,1,1)) substr($i,2)} 1'
}

for dir in "$ROOT"/*/; do
  name="$(basename "$dir")"
  case "$name" in _site|node_modules|.*) continue ;; esac

  built=""
  if [ -f "$dir/package.json" ] && jq -e '.scripts.build' "$dir/package.json" >/dev/null 2>&1; then
    echo "== $name: building"
    if (cd "$dir" && (npm ci --no-audit --no-fund || npm install --no-audit --no-fund) \
        && BASE_PATH="${BASE}${name}/" npm run build); then
      for cand in dist build out _site; do
        if [ -d "$dir/$cand" ]; then built="$dir/$cand"; break; fi
      done
    fi
    [ -z "$built" ] && echo "!! $name: build failed or produced no output directory" >&2
  elif [ -f "$dir/index.html" ]; then
    echo "== $name: static, copying as-is"
    built="$dir"
  else
    echo "-- $name: nothing to deploy yet — stub card"
  fi

  if [ -n "$built" ]; then
    mkdir -p "$OUT/$name"
    rsync -a --exclude node_modules --exclude '.git' "$built"/ "$OUT/$name/"
  fi

  meta="$dir/project.json"
  pname="$(prettify "$name")"; emoji="✨"; desc=""
  if [ -f "$meta" ]; then
    jname="$(jq -r '.name // empty' "$meta")"; [ -n "$jname" ] && pname="$jname"
    emoji="$(jq -r '.emoji // "✨"' "$meta")"
    desc="$(jq -r '.description // ""' "$meta")"
  fi
  if [ -n "$built" ]; then
    CARDS+="<a class=\"card\" href=\"./$name/\"><span class=\"emoji\">$emoji</span><h2>$pname</h2><p>$desc</p></a>"
  else
    # Not deployed yet: unlinked stub so every team is visible from day one.
    CARDS+="<div class=\"card stub\"><span class=\"emoji\">$emoji</span><h2>$pname</h2><p>${desc:-Coming soon.}</p><span class=\"badge\">in progress</span></div>"
  fi
done

# Gallery
sed "s|<!--CARDS-->|$(printf '%s' "$CARDS" | sed 's/[&|]/\\&/g')|" \
  "$ROOT/.site/gallery-template.html" > "$OUT/index.html"

echo "== site assembled:"
find "$OUT" -maxdepth 1 -mindepth 1 -type d | sort
