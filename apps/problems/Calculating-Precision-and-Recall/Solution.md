```python
def calculate_precision_recall(tp: int, fp: int, tn: int, fn: int) -> tuple:
    if tp + fp == 0:
        precision = 0.0
    else:
        precision = tp / (tp + fp)
    
    if tp + fn == 0:
        recall = 0.0
    else:
        recall = tp / (tp + fn)
    
    # Round to three decimal places
    precision = round(precision, 3)
    recall = round(recall, 3)
    
    return (precision, recall)