
module.exports = function(obj){
    let n = 1;
    /**
     * обход объекта и обход его внутренних объектов.
     * Если это массив, он все равно будет проходить каждый элемент (ключ - это индекс)
     * */
    function objectsTraversal(obj, nesting){
        if(n < nesting){
            n = nesting;
        }

        for(const key in obj){
            if(typeof obj[key] === 'object'){ // null это видимо тоже объект
                // console.log(`setIds: objectsTraversal by key ${key}:`, obj)
                objectsTraversal(obj[key], nesting + 1);
            }
        }
    }


    objectsTraversal(obj, n);

    console.log("getObjectDepth:", n);

    return n;
}