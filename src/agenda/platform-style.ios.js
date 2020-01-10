export default function platformStyles(appStyle) {
  return {
    knob: {
      width: 38,
      height: 7,
      marginTop: 10,
      borderRadius: 3,
      backgroundColor: appStyle.agendaKnobColor,
    },
    weekdays: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      // flexDirection: 'row',
      // justifyContent: 'space-around',
      paddingLeft: 15,
      paddingRight: 15,
      paddingTop: 5,
      paddingBottom: 7,
      backgroundColor: appStyle.calendarBackground,
    },
  };
}
