"""Helpers for product variants (color, model, size, etc.)."""

COLOR_ATTR_WORDS = frozenset({'', 'rangi', 'color', 'colour', 'colors', 'colours'})


def variant_is_color_mode(color_attr):
    if color_attr is None:
        return True
    return str(color_attr).strip().lower() in COLOR_ATTR_WORDS
