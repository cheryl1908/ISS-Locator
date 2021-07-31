import React from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, Platform, StatusBar, ImageBackground, Image, Dimensions} from 'react-native';
import axios from 'axios';

export default class Meteors extends React.Component{
    constructor(props){
        super(props);
        this.state={
            meteors:{}
        }
    }
    componentDidMount(){
    this.getMeteors();
    }
    getMeteors=async()=>{
        axios.get("https://api.nasa.gov/neo/rest/v1/feed?api_key=qp9q4n8aRgHMl1NSePpkqkRTgzZNKkP3vD74kVmg")
        .then(response=>{
            this.setState({
                meteors:response.data.near_earth_objects
            })
        }).catch(error=>console.log(error))
    }
    renderItem=({item})=>{
       var meteor=item;
       var bgImg, speed, size
       if(meteor.threat_score<=30){
           bgImg=require("../assets/meteor_bg1.png");
           speed=require("../assets/meteor_speed3.gif");
           size=100;
       }else if(meteor.threat_score<=75){
        bgImg=require("../assets/meteor_bg2.png");
        speed=require("../assets/meteor_speed3.gif");
        size=150;
       }else{
        bgImg=require("../assets/meteor_bg3.png");
        speed=require("../assets/meteor_speed3.gif");
        size=200;
       }
       return(
           <View>
               <ImageBackground source={bgImg} style={styles.bgImg}> 
                    <View style={styles.gifContainer}>
                        <Image source={speed} style={{width:size, height:size, alignSelf:'center'}}/>
                        <View style={styles.listContainer}> 
                            <Text style={[styles.cardTitle,{marginTop:400, marginLeft:50}]}>{item.name}</Text>
                            <Text style={[styles.card,{marginTop:20, marginLeft:50}]}> Closet to the Earth-{item.close_approach_data[0].close_approach_date_full} </Text>
                            <Text style={[styles.card,{marginTop:5, marginLeft:50}]}> Maximum Diatmeter (KM)-{item.estimated_diameter.kilometers.estimated_diameter_max} </Text>
                            <Text style={[styles.card,{marginTop:5, marginLeft:50}]}> Minimum Diatmeter (KM)-{item.estimated_diameter.kilometers.estimated_diameter_min} </Text>
                            <Text style={[styles.card,{marginTop:5, marginLeft:50}]}> Velocity (KM/HR)-{item.close_approach_data[0].relative_velocity.kilometers_per_hour} </Text>
                            <Text style={[styles.card,{marginTop:5, marginLeft:50}]}> Missing Earth By (KM)-{item.close_approach_data[0].miss_distance.kilometers} </Text>
                        </View>
                    </View>
               </ImageBackground>
           </View>
       ) 
    }
    render(){
        if(Object.keys(this.state.meteors).length===0){
            return(
                <View style={{flex:1, justifyContent:'center', alignItems:'center',}}>
                    <Text> Loading.... </Text>
                </View>
            )
        }else{
            var meteor_array=Object.keys(this.state.meteors).map(meteors_date=>{
                return(
                    this.state.meteors[meteors_date]
                )
            })
            var meteors=[].concat.apply([],meteor_array);
            meteors.forEach(function(element){
                var diameter=(element.estimated_diameter.kilometers.estimated_diameter_min+element.estimated_diameter.kilometers.estimated_diameter_max)/2
                var threatScore=(diameter/element.close_approach_data[0].miss_distance.kilometers)*1000000000
                element.threat_score=threatScore
            })
            meteors.sort(function(a,b){
                return(b.threat_score-a.threat_score);
            })
            meteors=meteors.slice(0,5);
            console.log(meteors)
            return(
                <View style={styles.container}>
                    <SafeAreaView style={styles.androidSafeArea}/>
                    <FlatList keyExtractor={(item,index)=>index.toString()} data={meteors} renderItem={this.renderItem} horizontal={true}>

                    </FlatList>
                </View>
            )
    } 
    }
}
const styles=StyleSheet.create({
    container:{
        flex:1
    },
    androidSafeArea:{
        marginTop:Platform.OS==="android"?StatusBar.currentHeight:0,
    },
    bgImg:{
        flex:1,
        resizeMode:"cover",
        width:Dimensions.get("window").width,
        height:Dimensions.get("window").height,
    },
    gifContainer:{
        justifyContent:'center',
        alignItems:'center',
        flex:1
    },
    cardTitle:{
        fontSize:20,
        fontWeight:'bold',
        color:'white',
        marginBottom:10
    },
    listContainer:{

    },
    card:{
        color:'white'
    }
})

