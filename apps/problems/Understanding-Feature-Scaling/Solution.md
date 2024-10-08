```python
def min_max_scale(features):
    if not features or not features[0]:
        return features

    # Transpose the features to process each feature column separately
    transposed = list(map(list, zip(*features)))
    
    # Normalize each feature column
    for i in range(len(transposed)):
        col = transposed[i]
        col_min, col_max = min(col), max(col)
        if col_max != col_min:
            transposed[i] = [(x - col_min) / (col_max - col_min) for x in col]
        else:
            transposed[i] = [0.0 for _ in col]
    
    # Transpose back to the original structure
    result = list(map(list, zip(*transposed)))
    return result