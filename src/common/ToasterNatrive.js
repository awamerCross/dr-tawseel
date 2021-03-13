import React from 'react'
import { Toast } from 'native-base'
import { Alert } from 'react-native'

const ToasterNative = (text, type, position, callback) => {



    return (
        Toast.show({
            text: text,
            type: type,
            duration: 3000,
            position: position,
            textStyle: {
                color: "white",
                fontFamily: 'flatMedium',
                textAlign: 'center',
                alignSelf: 'center',

            }
        })

    )
}

export { ToasterNative }


// const kk = () => {
//     let lll = 'dndkkld';
//     callback(lll)
// }


// callback = {(e)=> console.log(e)}