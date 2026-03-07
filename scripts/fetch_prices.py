#!/usr/bin/env python3
"""Fetch daily price data from Stooq and update docs/data/*.js files."""

import csv
import io
import sys
import time
import urllib.request
from pathlib import Path

DOCS_DATA = Path(__file__).resolve().parent.parent / "docs" / "data"

# Stooq symbol -> (JS variable name, output filename)
INDICES = {
    "^spx":   ("SP500_DATA",      "sp500.js"),
    "^ndq":   ("NASDAQ100_DATA",  "nasdaq100.js"),
    "^dji":   ("DOWJONES_DATA",   "dowjones.js"),
    "vti.us": ("VTI_DATA",        "vti.js"),
    "^nkx":   ("NIKKEI225_DATA",  "nikkei225.js"),
    "xauusd": ("GOLD_DATA",       "gold.js"),
}

STOOQ_URL = "https://stooq.com/q/d/l/?s={symbol}&i=d"


def fetch_csv(symbol: str) -> str:
    """Fetch CSV data from Stooq with retry."""
    url = STOOQ_URL.format(symbol=symbol)
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=30) as resp:
                return resp.read().decode("utf-8")
        except Exception as e:
            if attempt == 3:
                raise
            wait = 2 ** (attempt + 1)
            print(f"  Retry {attempt+1} for {symbol} in {wait}s: {e}")
            time.sleep(wait)


def parse_csv(raw: str) -> list[tuple[str, float]]:
    """Parse Stooq CSV into [(date, close), ...] sorted by date ascending."""
    reader = csv.DictReader(io.StringIO(raw))
    rows = []
    for row in reader:
        try:
            date = row["Date"]
            close = float(row["Close"])
            rows.append((date, close))
        except (KeyError, ValueError):
            continue
    rows.sort(key=lambda r: r[0])
    return rows


def read_existing(filepath: Path) -> list[tuple[str, float]]:
    """Parse existing JS data file to extract date/price pairs."""
    if not filepath.exists():
        return []
    text = filepath.read_text()
    # Format: const XXX_DATA = [["2020-01-01",123.45],...];\n
    start = text.find("[[")
    end = text.rfind("]]")
    if start == -1 or end == -1:
        return []
    inner = text[start + 1 : end + 1]  # ["2020-01-01",123.45],...,["2020-12-31",456.78]
    rows = []
    for chunk in inner.split("],["):
        chunk = chunk.strip("[]")
        parts = chunk.split(",", 1)
        if len(parts) == 2:
            date = parts[0].strip('"')
            try:
                price = float(parts[1])
                rows.append((date, price))
            except ValueError:
                continue
    return rows


def write_js(filepath: Path, var_name: str, rows: list[tuple[str, float]]) -> None:
    """Write data as a single-line JS const."""
    pairs = ",".join(f'["{d}",{p}]' for d, p in rows)
    filepath.write_text(f"const {var_name} = [{pairs}];\n")


def main():
    updated = []

    for symbol, (var_name, filename) in INDICES.items():
        filepath = DOCS_DATA / filename
        print(f"Fetching {symbol} -> {filename} ...")

        existing = read_existing(filepath)
        existing_dates = {d for d, _ in existing}

        raw = fetch_csv(symbol)
        fetched = parse_csv(raw)

        if not fetched:
            print(f"  WARNING: No data returned for {symbol}, skipping.")
            continue

        # Merge: keep existing, add new dates
        new_rows = [(d, p) for d, p in fetched if d not in existing_dates]

        if not new_rows:
            print(f"  No new data for {symbol} (latest: {existing[-1][0] if existing else 'N/A'}).")
            continue

        merged = existing + new_rows
        merged.sort(key=lambda r: r[0])

        write_js(filepath, var_name, merged)
        print(f"  Updated {filename}: +{len(new_rows)} rows (total {len(merged)}, latest: {merged[-1][0]}).")
        updated.append(filename)

        # Be polite to Stooq
        time.sleep(1)

    if updated:
        print(f"\nUpdated files: {', '.join(updated)}")
    else:
        print("\nNo updates needed.")

    # Exit code 0 = updated, 1 = no updates (used by workflow)
    sys.exit(0 if updated else 1)


if __name__ == "__main__":
    main()
