def targetSum(array, target):
    arrayIndex = {}

    for i, num in enumerate(array):
        
        result = target - num
        
        if result in arrayIndex:
        
            return [arrayIndex[result], i]
        arrayIndex[num] = i
    return None 

array = [2, 7, 11, 15]
target = 9
result = targetSum(array, target)
print(result)    
