import React , {useState, useEffect} from 'react';
import {TextInput, StyleSheet, View, Text,TouchableHighlight} from 'react-native';
import Constants from 'expo-constants';
import {decode, encode} from 'base-64'

if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

import firebase from "firebase/app";
import 'firebase/firestore';

var firebaseConfig = {
  apiKey: "AIzaSyDxOoDAnxu42pXk7Da2qQ4sgicCHbk8zEE",
  authDomain: "crud-react-native-43b72.firebaseapp.com",
  databaseURL: "https://crud-react-native-43b72.firebaseio.com",
  projectId: "crud-react-native-43b72",
  storageBucket: "crud-react-native-43b72.appspot.com",
  messagingSenderId: "278074182140",
 appId: "1:278074182140:web:d274f3a1ff1d5e28cf8a79"
};

let fire ;
if(!firebase.apps.length){
   fire  =  firebase.initializeApp(firebaseConfig);
}
 fire= firebase.app();

export default function App(){
 
  const [id, setId] = useState('');
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [lista, setLista] = useState([]);
  const [bandera, setBandera] = useState(false);
// guardar en firebase
const guardar = async () => {
  try {
      
    if(!bandera){ 
        await fire.firestore().collection('producto').add({
          nombre,
          precio
     });
    }else{
      await fire.firestore().collection('producto').doc(id).set({
        nombre,
        precio
      })
    }
     } catch (error) { } 
    
    setNombre('');
    setPrecio('');
    setBandera(false)
    listar();
 }
//lista datos de firebase
const  listar = async () => {
  let vector = [];
  try {
    const snapshot =  await fire.firestore().collection('producto').get(); 
    await snapshot.forEach((doc) => {
      let obj = {id:doc.id, nombre:doc.data().nombre, precio:doc.data().precio};
          vector.push(obj) 
      }); 
      setLista(vector); 
     } catch (error) {   }
 }

 useEffect(() => {
    listar();
},[]);

const eliminar = async (id) => {
  try {
       await fire.firestore().collection('producto').doc(id).delete();  
  } catch (error) {  }
    listar();
}

const editar = (id, nombre, precio) => {
 
    setNombre(nombre);
    setPrecio(precio);
    setId(id); 
    setBandera(true);
  }

return (
  
  <View style={styles.container}>
      <TextInput
        style={{ width:400, height: 50,fontSize:22,margin:10}}
        placeholder="Nombre"
        onChangeText={nombre => setNombre(nombre)}
        value={nombre}
      />
       <TextInput
        style={{width:400, height: 50 ,fontSize:22,margin:10}}
        placeholder="Precio"
        onChangeText={precio => setPrecio(precio)}
        value={precio}
      />
     
     <TouchableHighlight style={styles.buttonForm}
                 activeOpacity={0.6}
                 underlayColor="#DDDDDD"
                 onPress={() => guardar()}>
               <Text>Guardar</Text>
              </TouchableHighlight>
    
  <View style={{flex:3}}>
       
     {lista.map(item => (
           <View key={item.id} style={{flexDirection:'column'}}>
             <Text>{item.nombre}</Text>
             <Text>{item.precio}</Text>
             <View style={{flex: 3, flexDirection:'row', marginRight:15, height:100}}>
             <TouchableHighlight style={styles.button}
                   onPress={() => eliminar(item.id)}>
                  <Text style={styles.texto} > Eliminar </Text>
              </TouchableHighlight>

              <TouchableHighlight style={styles.buttonEditar}
                   onPress={() => editar(item.id,item.nombre,item.precio)}>
                  <Text style={styles.texto} > Editar </Text>
              </TouchableHighlight>
             </View>        
             </View>
           ))}
      </View>
      </View>
  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop:Constants.statusBarHeight,
  },
  button:{
    marginLeft:15,
    width:100,
    backgroundColor:'#F21171',
    padding:15
  },
  buttonEditar:{
    marginLeft:15,
    width:100,
    backgroundColor:'#6611F2',
    padding:15
  },
  buttonForm:{
    marginLeft:140,
    width:110,
    backgroundColor:'blue',
    padding:15
  },
  texto:{
    color:'#fff',
    fontSize:16
  }

});
