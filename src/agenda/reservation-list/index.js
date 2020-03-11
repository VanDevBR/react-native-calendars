import React, {Component} from 'react';
import {ActivityIndicator, FlatList, View} from 'react-native';
import Reservation from './reservation';
import PropTypes from 'prop-types';
import XDate from 'xdate';

import dateutils from '../../dateutils';
import styleConstructor from './style';


class ReservationList extends Component {
  static displayName = 'IGNORE';

  static propTypes = {
    // specify your item comparison function for increased performance
    rowHasChanged: PropTypes.func,
    // specify how each item should be rendered in agenda
    renderItem: PropTypes.func,
    // specify how each date should be rendered. day can be undefined if the item is not first in that day.
    renderDay: PropTypes.func,
    // specify how empty date content with no items should be rendered
    renderEmptyDate: PropTypes.func,
    // callback that gets called when day changes while scrolling agenda list
    onDayChange: PropTypes.func,
    // onScroll ListView event
    onScroll: PropTypes.func,
    // the list of items that have to be displayed in agenda. If you want to render item as empty date
    // the value of date key kas to be an empty array []. If there exists no value for date key it is
    // considered that the date in question is not yet loaded
    reservations: PropTypes.object,
    //specify how each row should be rendered. Overrides renderDay, renderItem and renderEmptyDate
    renderItemRow: PropTypes.func,

    selectedDay: PropTypes.instanceOf(XDate),
    topDay: PropTypes.instanceOf(XDate),
    refreshControl: PropTypes.element,
    refreshing: PropTypes.bool,
    onRefresh: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.styles = styleConstructor(props.theme);

    this.state = {
      reservations: [],
      isLoading: false
    };

    this.heights=[];
    this.selectedDay = this.props.selectedDay;
    this.scrollOver = true;
    this.loadTimeout = null;
  }

  UNSAFE_componentWillMount() {
    this.updateDataSource(this.getReservations(this.props).reservations);
  }

  updateDataSource(reservations) {
    this.setState({
      reservations
    });
  }

  updateReservations(props) {
    const reservations = this.getReservations(props);
    if (this.list && (this.props.topDay !== props.topDay || !dateutils.sameDate(props.selectedDay, this.selectedDay))) {
      let scrollPosition = 0;
      for (let i = 0; i < reservations.scrollPosition; i++) {
        scrollPosition += this.heights[i] || 0;
      }
      this.scrollOver = false;
      this.list.scrollToOffset({offset: scrollPosition, animated: true});
    }
    this.selectedDay = props.selectedDay;
    this.updateDataSource(reservations.reservations);
  }

  updateReservationsCore(props) {
    if(this.list){
      const reservations = this.getReservations(props);
      let scrollPosition = 0;
      for (let i = 0; i < reservations.scrollPosition; i++) {
        scrollPosition += this.heights[i] || 0;
      }
      this.scrollOver = false;
      this.list.scrollToOffset({offset: scrollPosition, animated: true});
      this.selectedDay = props.selectedDay;
      this.updateDataSource(reservations.reservations);
    }
  }

  UNSAFE_componentWillReceiveProps(props) {
    // console.log('>>> receivingProps:', props);
    if (!dateutils.sameMonth(props.topDay, this.props.topDay)) {
      this.setState(
        {
          reservations: []
        },
        () => {
          this.updateReservations(props);
        },
      );
    } else {
      this.updateReservations(props);
    }
  }

  onScroll(event) {
    const yOffset = event.nativeEvent.contentOffset.y;
    this.props.onScroll(yOffset);
    let topRowOffset = 0;
    let topRow;
    for (topRow = 0; topRow < this.heights.length; topRow++) {
      if (topRowOffset + this.heights[topRow] / 2 >= yOffset) {
        break;
      }
      topRowOffset += this.heights[topRow];
    }
    const row = this.state.reservations[topRow];
    if (!row) return;
    const day = row.day;
    const sameDate = dateutils.sameDate(day, this.selectedDay);
    if (!sameDate && this.scrollOver) {
      this.selectedDay = day.clone();
      this.props.onDayChange(day.clone());
    }
    if (this.props.onScroll) {
      this.props.onScroll(event);
    }
  }

  onRowLayoutChange(ind, event) {
    this.heights[ind] = event.nativeEvent.layout.height;
  }

  renderRow({item, index}) {
    return (
      <View onLayout={this.onRowLayoutChange.bind(this, index)}>
        <Reservation
          item={item}
          renderItem={this.props.renderItem}
          renderDay={this.props.renderDay}
          renderEmptyDate={this.props.renderEmptyDate}
          theme={this.props.theme}
          rowHasChanged={this.props.rowHasChanged}
          // hideItem={this.props.hideItem}
          renderItemRow={this.props.renderItemRow}
        />
      </View>
    );
  }

  getReservationsForDay(iterator, props) {
    const day = iterator.clone();
    const res = props.reservations[day.toString('yyyy-MM-dd')];
    if (res && res.length) {
      return res.map((reservation, i) => {
        return {
          reservation,
          date: i ? false : day,
          day
        };
      });
    } else if (res) {
      return [
        {
          date: iterator.clone(),
          day
        }
      ];
    } else {
      return false;
    }
  }

  onListTouch() {
    this.scrollOver = true;
  }

  getReservations(props) {
    if (!props.reservations || !props.selectedDay) {
      return {reservations: [], scrollPosition: 0};
    }
    let reservations = [];
    let scrollPosition = 0;
    let iterator = props.selectedDay.clone();
    iterator.setDate(1);

    let lastDay = iterator.clone();
    lastDay.setMonth(lastDay.getMonth()+1);
    lastDay.setDate(0);

    for (let i = 0; i <= lastDay.getDate(); i++) {
      if(iterator.getMonth() !== lastDay.getMonth()){
        break;
      }

      const res = this.getReservationsForDay(iterator, props);
      if (res) {
        if(iterator.getTime() === props.selectedDay.getTime()){
          scrollPosition = reservations.length;
        }
        reservations = reservations.concat(res);
      }
      iterator.addDays(1);
    }

    return {reservations, scrollPosition};
  }

  render() {
    if (
      !this.props.reservations ||
      !this.props.reservations[this.props.selectedDay.toString('yyyy-MM-dd')]
    ) {
      if (this.props.renderEmptyData) {
        return this.props.renderEmptyData();
      }
      return (
        <ActivityIndicator
          style={{marginTop: 80}}
          color={this.props.theme && this.props.theme.indicatorColor}
        />
      );
    }
    return (
      <View>
        <FlatList
          ref={c => (this.list = c)}
          style={this.props.style}
          contentContainerStyle={this.styles.content}
          renderItem={this.renderRow.bind(this)}
          data={this.state.reservations}
          onScroll={this.onScroll.bind(this)}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={200}
          onMoveShouldSetResponderCapture={() => {
            this.onListTouch();
            return false;
          }}
          keyExtractor={(item, index) => String(index)}
          refreshControl={this.props.refreshControl}
          refreshing={this.props.refreshing || false}
          onRefresh={this.props.onRefresh}
          scrollEnabled={!this.state.isLoading}
          onContentSizeChange={()=>{
            if(this.loadTimeout){
              clearTimeout(this.loadTimeout);
              this.setState({isLoading: true});
            }
            this.loadTimeout = setTimeout(()=>{
              this.updateReservationsCore(this.props);
              this.setState({isLoading: false});
            }, 700);
          }}
        />
        {this.state.isLoading && (
          <View style={{backgroundColor:'#FFFFFFD9', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator
              style={{marginTop: 80}}
              color={this.props.theme && this.props.theme.indicatorColor}
            />
          </View>
        )}
      </View>
    );
  }
}

export default ReservationList;
