#!/usr/bin/env bash
# verses.sh — חיפוש בבנק הפסוקים של שלושת ספרי שלמה
#
# Usage:
#   verses.sh <query>                  # search all three books (Hebrew or English)
#   verses.sh <query> --book mishlei   # limit to one book: mishlei|kohelet|shir
#   verses.sh --tags                   # list every tag in the bank
#   verses.sh --all --book kohelet     # dump a whole book
#   verses.sh --count                  # how many verses in the bank
set -euo pipefail

REF_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../references" && pwd)"

usage() {
  sed -n '2,10p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
  exit "${1:-0}"
}

query=""
book="all"
mode="search"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --book)   book="${2:-}"; shift 2 ;;
    --tags)   mode="tags"; shift ;;
    --all)    mode="all"; shift ;;
    --count)  mode="count"; shift ;;
    -h|--help) usage 0 ;;
    -*)       echo "unknown flag: $1" >&2; usage 1 ;;
    *)        query="$1"; shift ;;
  esac
done

files=()
case "$book" in
  all)                    files=("$REF_DIR/mishlei.md" "$REF_DIR/kohelet.md" "$REF_DIR/shir-hashirim.md") ;;
  mishlei|proverbs|משלי)  files=("$REF_DIR/mishlei.md") ;;
  kohelet|ecclesiastes|קהלת) files=("$REF_DIR/kohelet.md") ;;
  shir|song|שיר)          files=("$REF_DIR/shir-hashirim.md") ;;
  *) echo "unknown book: $book (use mishlei|kohelet|shir)" >&2; exit 1 ;;
esac

case "$mode" in
  tags)
    grep -h '^tags:' "${files[@]}" \
      | sed 's/^tags: *//' \
      | tr ',' '\n' \
      | sed 's/^ *//; s/ *$//' \
      | grep -v '^$' \
      | sort -u
    exit 0
    ;;
  count)
    grep -hc '^### ' "${files[@]}" | awk '{ n += $1 } END { print n }'
    exit 0
    ;;
esac

if [[ "$mode" == "search" && -z "$query" ]]; then
  usage 1
fi

# Records start at a "### " heading and run until the next one.
# Print a record when the query appears anywhere inside it (case-insensitive
# for Latin text; Hebrew is caseless so plain matching works).
awk -v q="$query" -v mode="$mode" '
  function flush() {
    if (rec == "") return
    if (mode == "all" || index(tolower(rec), tolower(q)) > 0) {
      printf "%s\n", rec
      found++
    }
    rec = ""
  }
  /^### / { flush(); rec = $0; next }
  rec != "" && /^(##|---)/ { flush(); next }
  rec != "" && NF { rec = rec "\n" $0 }
  END { flush(); if (found == 0) exit 3 }
' "${files[@]}" || {
  status=$?
  if [[ $status -eq 3 ]]; then
    echo "אין פסוק בבנק לנושא: $query" >&2
    echo "נסה: verses.sh --tags   (רשימת כל התגיות)" >&2
    exit 3
  fi
  exit $status
}
