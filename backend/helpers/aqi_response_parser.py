class AQIResponse:
    def __init__(self, aqi_response: dict):
        """
        Initialize an AQIResponse with a response from Google's Air Quality API. See:
        https://developers.google.com/maps/documentation/air-quality/current-conditions#multiple_parameters_response
        """
        self.aqi_response: dict = aqi_response["indexes"][0]

    def get_code(self) -> str:
        return self.aqi_response["code"]

    def get_display_name(self) -> str:
        return self.aqi_response["display_name"]

    def get_aqi(self) -> int:
        return self.aqi_response["aqi"]

    def get_aqi_display(self) -> str:
        return self.aqi_response["aqiDisplay"]

    def get_color(self) -> tuple[float, float, float]:
        color = self.aqi_response["color"]
        return (color["red"],
                color["green"],
                color["blue"])

    def get_category(self) -> str:
        return self.aqi_response["category"]

    def get_dominant_pollutant(self) -> str:
        return self.aqi_response["dominantPollutant"]
