"""B200 training hooks — real training lives here, frozen weights ship to tools.

Each script supports:
  --smoke            tiny synthetic run on CPU (CI-safe, no data needed)
  --data DIR         real dataset root (CheXpert-small / HAM10000 / synthetic packs)
  --out PATH         weights output (tools load only this file, never train at serve)

No invented metrics: scripts print honest split scores only when labels exist.
"""
