export const getKeys = (map) => {
    let result = []; 
    for (let key in map){
        result.push(key);
    }
    return result;
}

export const returnTrimmedProperty = (property) =>{
   return  property.trim().slice(0, 20).replaceAll(" ", "%20") + "...";
}