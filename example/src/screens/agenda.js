import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {Agenda} from 'react-native-calendars';

export default class AgendaScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {}
    };
    this.agenda;
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <TouchableOpacity style={{alignSelf: 'center', backgroundColor: '#00BBF2', padding: 5, margin: 5, borderRadius: 5}} onPress={()=>{
          if(this.agenda){
            this.agenda.goToToday();
          }
        }}>
          <Text style={{color: 'white'}}>today</Text>
        </TouchableOpacity>
        <Agenda
          ref={(r)=>{this.agenda = r;}}
          items={this.state.items}
          loadItemsForMonth={this.loadItems.bind(this)}
          selected={'2020-01-01'}
          renderItem={this.renderItem.bind(this)}
          renderEmptyDate={this.renderEmptyDate.bind(this)}
          rowHasChanged={this.rowHasChanged.bind(this)}
          showTodayButton={true}
          // disableExtraDays={true}
          lazyLoadMonths={true}
        // markingType={'period'}
        // markedDates={{
        //    '2017-05-08': {textColor: '#43515c'},
        //    '2017-05-09': {textColor: '#43515c'},
        //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
        //    '2017-05-21': {startingDay: true, color: 'blue'},
        //    '2017-05-22': {endingDay: true, color: 'gray'},
        //    '2017-05-24': {startingDay: true, color: 'gray'},
        //    '2017-05-25': {color: 'gray'},
        //    '2017-05-26': {endingDay: true, color: 'gray'}}}
        // monthFormat={'yyyy'}
        // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
        //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
        // hideExtraDays={false}
        />
      </View>
    );
  }

  loadItems(day) {
    setTimeout(() => {
      let newItems = {};

      for (let i = 1; i <= 28; i++) {
        var key =
          day.year +
          '-' +
          day.month.toString().padStart(2, '0') +
          '-' +
          i.toString().padStart(2, '0');
        newItems[key] = [{name: 'Item for: ' + key}];
      }
      this.setState({
        items: newItems
      });
    }, 2000);
    // console.log(`Load Items for ${day.year}-${day.month}`);
  }

  renderItem(item) {
    return (
      <View style={[styles.item, {height: item.height}]}>
        <Text>{item.name}</Text>
      </View>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  }
});
