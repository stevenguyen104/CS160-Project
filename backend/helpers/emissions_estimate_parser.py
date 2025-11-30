class EmissionsEstimate:
    def __init__(self, emissions_estimate: dict):
        """
        Initialize an EmissionsEstimate with a response from the CarbonSutra Emission Estimation API.
        See: https://www.carbonsutra.com/api-carbon-emission-vehicles-model.html
        """
        self.emissions_estimate: dict = emissions_estimate

    def get_dict(self) -> dict:
        return self.emissions_estimate

    def get_success(self) -> bool:
        return self.emissions_estimate["success"]

    def get_status(self) -> int:
        return self.emissions_estimate["status"]

    def get_data(self) -> dict:
        return self.emissions_estimate["data"]

    def get_api_type(self) -> str:
        return self.emissions_estimate["type"]

    def get_distance_unit(self) -> str:
        return self.emissions_estimate["distance_unit"]

    def get_distance_value(self) -> int:
        return int(self.emissions_estimate["distance_value"])

    def get_vehicle_make(self) -> str:
        return self.emissions_estimate["vehicle_make"]

    def get_vehicle_model(self) -> str:
        return self.emissions_estimate["vehicle_model"]

    def get_co2e_grams(self) -> int:
        return self.emissions_estimate["co2e_gm"]

    def get_co2e_kilograms(self) -> float:
        return self.emissions_estimate["co2e_kg"]

    def get_co2e_metric_tons(self) -> float:
        return self.emissions_estimate["co2e_mt"]

    def get_co2e_pounds(self) -> float:
        return self.emissions_estimate["co2e_lb"]
