const doWorkCallback = (callback)=>{
    setTimeout(()=>{
        // callback('This is an err', undefined)
        callback(undefined, [1,4,6])
    }, 2000)
}

doWorkCallback((error, result)=>{
    if(error){
        return console.log(error)
    }

    console.log(result)
})