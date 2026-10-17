"""
patch_shap.py — Patches SHAP 0.49.x to work with XGBoost 3.x.

XGBoost 3.x stores base_score as '[value]' (bracket notation) in its
raw binary format. SHAP 0.49.x tries to directly float() that string
and crashes. This script patches the SHAP library file in-place at
build time so every subsequent import of shap works correctly.

Run once during deployment build: python patch_shap.py
"""
import re
import sys
from pathlib import Path

OLD = (
    "        self.n_trees_per_iter = int(diff[0])\n"
    "        self.n_targets = n_targets\n"
    "        self.base_score = float(learner_model_param[\"base_score\"])\n"
    "        assert self.n_trees_per_iter > 0\n"
    "\n"
    "        self.name_obj = objective[\"name\"]\n"
    "        self.name_gbm = booster[\"name\"]\n"
    "        # handle the link function.\n"
    "        base_score = float(learner_model_param[\"base_score\"])"
)

NEW = (
    "        self.n_trees_per_iter = int(diff[0])\n"
    "        self.n_targets = n_targets\n"
    "        # XGBoost 3.x stores base_score as '[value]' — strip brackets\n"
    "        _raw_bs = str(learner_model_param[\"base_score\"])\n"
    "        import re as _re\n"
    "        _raw_bs = _re.sub(r\"[\\[\\]]\", \"\", _raw_bs).strip()\n"
    "        self.base_score = float(_raw_bs)\n"
    "        assert self.n_trees_per_iter > 0\n"
    "\n"
    "        self.name_obj = objective[\"name\"]\n"
    "        self.name_gbm = booster[\"name\"]\n"
    "        # handle the link function.\n"
    "        base_score = float(_raw_bs)"
)

def find_shap_tree_file():
    for p in sys.path:
        candidate = Path(p) / "shap" / "explainers" / "_tree.py"
        if candidate.exists():
            return candidate
    # fallback: search site-packages
    import site
    for sp in site.getsitepackages():
        candidate = Path(sp) / "shap" / "explainers" / "_tree.py"
        if candidate.exists():
            return candidate
    return None

def main():
    target = find_shap_tree_file()
    if target is None:
        print("ERROR: Could not find shap/explainers/_tree.py — is shap installed?")
        sys.exit(1)

    content = target.read_text(encoding="utf-8")

    if "_raw_bs" in content:
        print(f"SHAP patch already applied at {target} — skipping.")
        return

    if OLD not in content:
        print(f"WARNING: Expected pattern not found in {target}.")
        print("SHAP version may have changed. Check manually.")
        # Don't fail the build — just warn
        return

    patched = content.replace(OLD, NEW)
    target.write_text(patched, encoding="utf-8")
    print(f"✓ SHAP patch applied successfully at {target}")

if __name__ == "__main__":
    main()
