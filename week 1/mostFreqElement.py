def mostFreqElement(array):
    freq = {}
    for element in array:
        if element in freq:
            freq[element] += 1
        else:
            freq[element] = 1

    maxFrequentElement = 0
    mostFrequentArray = None

    for key, vaule in freq.items():
        if vaule > maxFrequentElement:
            maxFrequentElement = vaule
            mostFrequentArray = key
            
    return mostFrequentArray
        
array = [1, 2, 3, 2, 4, 5]
result = mostFreqElement(array)
print(result)
        