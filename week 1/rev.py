#Reverse string
def reverse_string(s):
    revStr = ""
    for c in s:
        revStr = c + revStr
    return revStr


print(reverse_string("hello")) 
print(reverse_string("Data Structures"))  
print(reverse_string("")) 
