"""S3 runner."""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from care_pathway.slice_t3_kie.synth_packs import smoke, write_synth_batch

if __name__ == "__main__":
    write_synth_batch(5, Path("artifacts/slice_t3_packs.txt"))
    print(smoke())
