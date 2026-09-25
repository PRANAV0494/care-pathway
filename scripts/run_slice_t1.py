"""S1 runner — CheXpert split smoke (no data needed)."""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from care_pathway.slice_t1_chexpert.chexpert_loader import smoke

if __name__ == "__main__":
    print(smoke())
