const add = (a,b) =>{ return new Promise((resolve, reject) => {
    setTimeout(() => {
         resolve(a+b)
    }, 2000)
})
}

// add(1,2).then((result) => {
//     console.log('Success ' + result)
//     add(result, 3).then((sum2)=>{
//         console.log('Sum2 = ' + sum2)
//     }).catch((errSum2)=>{
//         console.log('Err sum2 = ' + errSum2)
//     })
// }).catch((error) => {
//     console.log('Error ' + error)
// })

add(1,2).then((sum)=>{
    console.log(sum)
    return add(sum, 4)
}).then((sum2)=>{
    console.log(sum2)
}).catch((e)=>{
    console.log(e)
})