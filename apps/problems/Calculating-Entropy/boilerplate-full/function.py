##USER_CODE_HERE##

def main():
    input_file_path = '/dev/problems/Calculating-Entropy/Tests/inputs/##INPUT_FILE_INDEX##.txt'
    with open(input_file_path, 'r') as file:
        input_data = file.read().strip().split('\n')
    input_list = input_data
    size_labels = int(input_list.pop(0))
    labels = input_list.pop(0).split()

    result = calculate_entropy(labels)

    print(result)

if __name__ == "__main__":
    main()
    