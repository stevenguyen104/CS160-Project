class PostgreSQLErrorCode:
    _CODES = {
        # 42501 is missing as it is manually handled in to_http_status
        "08*": 503,
        "09*": 500,
        "0L*": 403,
        "0P*": 403,
        "23503": 409,
        "23505": 409,
        "25006": 405,
        "25*": 500,
        "28*": 403,
        "2D*": 500,
        "38*": 500,
        "39*": 500,
        "3B*": 500,
        "40*": 500,
        "53400": 500,
        "53*": 503,
        "54*": 500,
        "55*": 500,
        "57*": 500,
        "58*": 500,
        "F0*": 500,
        "HV*": 500,
        "P0001": 400,
        "P0*": 500,
        "XX*": 500,
        "42883": 404,
        "42P01": 404,
        "42P17": 500,
        "PGRST000": 503,
        "PGRST001": 503,
        "PGRST002": 503,
        "PGRST003": 504,
        "PGRST100": 400,
        "PGRST101": 405,
        "PGRST102": 400,
        "PGRST103": 416,
        "PGRST105": 405,
        "PGRST106": 406,
        "PGRST107": 415,
        "PGRST108": 400,
        "PGRST109": 400,
        "PGRST110": 400,
        "PGRST111": 500,
        "PGRST112": 500,
        "PGRST114": 400,
        "PGRST115": 400,
        "PGRST116": 406,
        "PGRST117": 405,
        "PGRST118": 400,
        "PGRST119": 400,
        "PGRST120": 400,
        "PGRST121": 500,
        "PGRST122": 400,
        "PGRST200": 400,
        "PGRST201": 300,
        "PGRST202": 404,
        "PGRST203": 300,
        "PGRST204": 400,
        "PGRST300": 500,
        "PGRST301": 401,
        "PGRST302": 401,
        "PGRST*": 500,
        "OTHER": 400
    }

    def __init__(self, error_code: str | None, authenticated: bool = True):
        """
        Initialize a PostgreSQLErrorCode with a PostgreSQL error code.
        See: https://docs.postgrest.org/en/v12/references/errors.html
        """
        self.error_code = error_code
        self.authenticated = authenticated

    def to_http_status(self) -> int:
        """
        Return the correct HTTP status code for a PostgreSQL error code,
        following PostgREST v12 error behavior.
        """
        if not self.error_code:
            return self._CODES["OTHER"]
        
        if self.error_code == "42501":
            return 403 if self.authenticated else 401
        
        if self.error_code in self._CODES:
            return self._CODES[self.error_code]
        
        for prefix, status in self._CODES.items():
            if prefix.endswith("*"):
                if self.error_code.startswith(prefix[:-1]):
                    return status

        return self._CODES["OTHER"]
