```python
def solve_linear_system(coefficients, constants):
    n = len(coefficients)
    
    # Augment the coefficient matrix with the constants vector
    for i in range(n):
        coefficients[i].append(constants[i])

    # Forward elimination
    for i in range(n):
        # Search for maximum in this column
        max_el = abs(coefficients[i][i])
        max_row = i
        for k in range(i+1, n):
            if abs(coefficients[k][i]) > max_el:
                max_el = abs(coefficients[k][i])
                max_row = k
        
        # Swap maximum row with current row (column by column)
        coefficients[i], coefficients[max_row] = coefficients[max_row], coefficients[i]

        # Make all rows below this one 0 in current column
        for k in range(i+1, n):
            c = -coefficients[k][i] / coefficients[i][i]
            for j in range(i, n+1):
                if i == j:
                    coefficients[k][j] = 0
                else:
                    coefficients[k][j] += c * coefficients[i][j]

    # Solve equation Ax=b for an upper triangular matrix A
    solution = [0 for i in range(n)]
    for i in range(n-1, -1, -1):
        solution[i] = coefficients[i][n] / coefficients[i][i]
        for k in range(i-1, -1, -1):
            coefficients[k][n] -= coefficients[k][i] * solution[i]

    return solution