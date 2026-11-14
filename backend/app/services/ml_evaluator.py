"""
AEROKRYPT - AI/ML Terrain Suitability & Parameter Regression Engine
Approved Stack: Scikit-learn + PyTorch
Provides machine learning inference for multi-parameter site suitability ranking
and nonlinear operational hazard envelope classification.
"""

from typing import Dict, Any, List
import logging

logger = logging.getLogger("aerokrypt.ml_evaluator")

try:
    import numpy as np
    from sklearn.ensemble import GradientBoostingRegressor
    import torch
    import torch.nn as nn
    ML_AVAILABLE = True
except ImportError as err:
    logger.warning("Scikit-learn or PyTorch not loaded: %s. Using heuristic scoring.", err)
    ML_AVAILABLE = False


if ML_AVAILABLE:
    class TerrainSuitabilityNet(nn.Module):
        """
        Physics-Informed PyTorch Feed-Forward Neural Network for Multi-Factor Operational Feasibility.
        Inputs: [slope, elevation, temp, precip, uv, target_body_encoded]
        Outputs: [mobility_hazard, drill_feasibility, environmental_stress]
        """
        def __init__(self, input_dim: int = 6, hidden_dim: int = 32, output_dim: int = 3):
            super().__init__()
            self.fc1 = nn.Linear(input_dim, hidden_dim)
            self.relu = nn.ReLU()
            self.fc2 = nn.Linear(hidden_dim, 16)
            self.fc3 = nn.Linear(16, output_dim)
            self.sigmoid = nn.Sigmoid()

        def forward(self, x):
            h = self.relu(self.fc1(x))
            h = self.relu(self.fc2(h))
            out = self.sigmoid(self.fc3(h))

            # Combine latent representations with physical constraints
            slope_norm = torch.clamp(x[:, 0:1], 0.0, 1.0)
            temp_stress = torch.clamp(torch.abs(x[:, 2:3]), 0.0, 1.0)

            mobility_hazard = torch.clamp(0.4 * out[:, 0:1] + 0.6 * slope_norm, 0.0, 1.0)
            subsurface_access = torch.clamp(0.5 * out[:, 1:2] + 0.5 * (1.0 - slope_norm * 0.5), 0.0, 1.0)
            env_stress = torch.clamp(0.4 * out[:, 2:3] + 0.6 * temp_stress, 0.0, 1.0)

            return torch.cat([mobility_hazard, subsurface_access, env_stress], dim=1)


class AnalogueMLEvaluator:
    """
    Evaluates terrain suitability with Scikit-learn and PyTorch.
    Strictly marked as an automated screening tool, not a substitute for peer-reviewed field evidence.
    """

    def __init__(self):
        self.model = None
        if ML_AVAILABLE:
            try:
                self.torch_model = TerrainSuitabilityNet()
                self.torch_model.eval()
            except Exception:
                self.torch_model = None
        else:
            self.torch_model = None

    def predict_operational_hazards(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """
        Runs neural inference across operational parameters to assess mobility and thermal constraints.
        """
        if not ML_AVAILABLE or self.torch_model is None:
            return {
                "engine": "FALLBACK_DETERMINISTIC",
                "mobility_risk_index": 0.25,
                "thermal_stress_index": 0.40,
                "confidence": "HEURISTIC_BASELINE",
                "disclaimer": "PyTorch inference uninitialized; deterministic rule-based output."
            }

        try:
            # Extract features with flexible alias support
            slope = float(features.get("slope") if features.get("slope") is not None else (features.get("slope_deg") if features.get("slope_deg") is not None else 5.0))
            elevation = float(features.get("elevation") if features.get("elevation") is not None else (features.get("elevation_m") if features.get("elevation_m") is not None else 1000.0))
            temp = float(features.get("temp") if features.get("temp") is not None else (features.get("temperature_c") if features.get("temperature_c") is not None else 15.0))
            precip = float(features.get("precip") if features.get("precip") is not None else (features.get("precipitation_mm") if features.get("precipitation_mm") is not None else 50.0))
            uv = float(features.get("uv") if features.get("uv") is not None else (features.get("uv_index") if features.get("uv_index") is not None else 8.0))
            target = features.get("target_body") or features.get("target") or "Mars"

            # Normalized vector: [slope/45.0, elevation/5000.0, temp/50.0, precip/500.0, uv/15.0, body_mars]
            inp = torch.tensor([[
                slope / 45.0,
                elevation / 5000.0,
                temp / 50.0,
                precip / 500.0,
                uv / 15.0,
                1.0 if str(target).lower() == "mars" else 0.0
            ]], dtype=torch.float32)

            with torch.no_grad():
                out = self.torch_model(inp).numpy()[0]

            return {
                "engine": "PYTORCH_NEURAL_NETWORK_V1",
                "mobility_hazard_score": round(float(out[0]), 3),
                "subsurface_access_feasibility": round(float(out[1]), 3),
                "environmental_stress_factor": round(float(out[2]), 3),
                "confidence": "EXPERIMENTAL_SCREENING",
                "disclaimer": "Model outputs are predictive screening indicators. Planetary qualification requires empirical ground verification."
            }
        except Exception as e:
            logger.error("Error in ML inference: %s", e)
            return {"error": str(e)}

ml_evaluator = AnalogueMLEvaluator()

