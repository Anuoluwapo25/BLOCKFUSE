import hashlib

def hash_function(value):
    return hashlib.sha256(value.encode('utf-8')).hexdigest()

def generate_merkle_tree(transactions):

    current_layer = [hash_function(tx) for tx in transactions]
    tree = [current_layer]  

    while len(current_layer) > 1:
        next_layer = []
        for i in range(0, len(current_layer), 2):
           
            left = current_layer[i]
            right = current_layer[i + 1] if i + 1 < len(current_layer) else current_layer[i]
            parent_hash = hash_function(left + right)
            next_layer.append(parent_hash)
        tree.append(next_layer)
        current_layer = next_layer

    return tree

# Get the proof for a specific transaction
def get_merkle_proof(tree, transaction_index):
    proof = []
    for layer in tree[:-1]:  
        sibling_index = transaction_index ^ 1  
        if sibling_index < len(layer):
            proof.append(layer[sibling_index])
        transaction_index //= 2 
    return proof

def verify_transaction(transaction, proof, root_hash):
    current_hash = hash_function(transaction)
    for sibling_hash in proof:
        if current_hash < sibling_hash:  
            current_hash = hash_function(current_hash + sibling_hash)
        else:
            current_hash = hash_function(sibling_hash + current_hash)
    return current_hash == root_hash


if __name__ == "__main__":
  
    transactions = ["bq3w: 5", "CX7j: 27", "1FXq: 18", "9Dog: 64", "zUfe: 30", "jx5R: 2", "yo3G: 43", "vcc1: 48"]

    
    tree = generate_merkle_tree(transactions)
    root_hash = tree[-1][0]  

    
    transaction_index = 0  
    proof = get_merkle_proof(tree, transaction_index)

    is_valid = verify_transaction(transactions[transaction_index], proof, root_hash)

    print("Merkle Root:", root_hash)
    print("Proof for transaction:", proof)
    print("Is transaction valid?", is_valid)
