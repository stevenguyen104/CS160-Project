class StringUtils:
    def __init__(self, string: str | None, items: list | None):
        """
        Initialize a StringUtils object with a string, list, or both.
        """
        self.string = string
        self.items = items

    def snake_case_to_human(self) -> str:
        """
        Converts a snake_case string to human-readable text.
        Example: 'bad_response' -> 'Bad response'
        """
        if not self.string:
            return ""
        
        human_string = self.string.replace("_", " ")
        human_string = human_string.capitalize()
        return human_string
    
    def plural_suffix(self) -> str:
        """
        Append a 's' if something is plural.
        Example: 'place' -> 'places'
        """
        return "" if not self.items or len(self.items) == 1 else "s"