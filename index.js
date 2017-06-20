/**
 * Created by SHiNYJ on 6/15/17.
 */

import React, {PropTypes, Component} from 'react';
import {View, TouchableOpacity, Text, Image, StyleSheet} from 'react-native';
import Moment from 'moment';

export default class YCalendar extends Component {
    static propTypes = {
        today: PropTypes.any,
        todayStyle: PropTypes.any,
        weekStart: PropTypes.number, //0 - Sunday, 1 - Monday, 2 - Tuesday,
        dayHeadings: PropTypes.array,
        language: PropTypes.string,
        selectionStyle: PropTypes.any,
        calendarBackgroundStyle: PropTypes.any,
        calendarThemeColor: PropTypes.any,
        calendarSubThemeColor: PropTypes.any,
        rangeEventDates: PropTypes.array,
        rangeEventColor: PropTypes.any,
        rangeEventTextColor: PropTypes.any,
        eventOneDates: PropTypes.array,
        eventOneStyle: PropTypes.object,
        eventTwoDates: PropTypes.array,
        eventTwoStyle: PropTypes.object,
        eventThreeDates: PropTypes.array,
        eventThreeStyle: PropTypes.object,
        legendTitles: PropTypes.array,
        legendFigures: PropTypes.array,
        isTodayButton: PropTypes.bool,
        rightButton: PropTypes.string,
        isRightEnabled: PropTypes.bool,
        onRightPress: PropTypes.func,
        onDatePress: PropTypes.func,
    };

    static defaultProps = {
        today: Moment(),
        language: 'en',
        weekStart: 1, //Default: 1 - Monday
        dayHeadings: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN',],
        legendTitles: [],
        legendFigures: [],
        rangeEventDates: [],
        eventOneDates: [],
        eventTwoDates: [],
        eventThreeDates: [],
        calendarBackgroundStyle: {backgroundColor: '#00B8D4'},
        calendarThemeColor: '#FFFFFF',
        calendarSubThemeColor: '#6CCBDA',
        rangeEventColor: '#019CB4',
        rangeEventTextColor: undefined,
        isRightEnabled: true,

        selectionStyle: {
            width: 32,
            height: 2,
            bottom: 0,
            position: 'absolute',
            alignSelf: 'center',
            backgroundColor: '#FFFFFF',
        },
        todayStyle: {
            width: 32,
            height: 32,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 50,
            backgroundColor: '#6DCFF2',
        },
        eventOneStyle: {
            width: 32,
            height: 32,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#FFFFFF',
            borderRadius: 50,
            backgroundColor: 'transparent',
        },
        eventTwoStyle: {
            width: 4,
            height: 4,
            borderRadius: 50,
            position: 'absolute',
            right: 7,
            top: 7,
            alignSelf: 'center',
            backgroundColor: 'red',
        },
        eventThreeStyle: {
            width: 4,
            height: 4,
            borderRadius: 50,
            top: 7,
            position: 'absolute',
            alignSelf: 'center',
            backgroundColor: '#FFFFFF',
        },
    };

    constructor(props) {
        super(props);
        this.state = {
            currentMoment: props.today,
            selectedMoment: undefined,
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (this.state.selectedMoment !== nextState.selectedMoment)
            || (this.state.currentMoment !== nextState.currentMoment);
    }

    onPrev = () => {
        let newMoment = Moment(this.state.currentMoment).subtract(1, 'month');
        this.setState({currentMoment: newMoment});
    };

    onNext = () => {
        let newMoment = Moment(this.state.currentMoment).add(1, 'month');
        this.setState({currentMoment: newMoment});
    };

    renderTopBar = () => {
        const {
            calendarThemeColor,
            calendarSubThemeColor,
            rightButton,
            isRightEnabled,
            onRightPress,
            language,
            isTodayButton,
            today,
        } = this.props;

        return (
            <View style={styles.topBarContainer}>

                {isTodayButton &&
                <TouchableOpacity
                    style={{
                        left: 26,
                        position: 'absolute',
                    }}
                    onPress={() => {
                        this.setState({
                            currentMoment: today,
                            selectedMoment: today,
                        });
                    }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: calendarThemeColor,
                        }}
                    >
                        {(language === 'ko') ? '오늘' : 'TODAY'}
                    </Text>
                </TouchableOpacity>
                }

                <TouchableOpacity //Left Arrow
                    style={{marginRight: 40}}
                    hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                    onPress={this.onPrev}
                    activeOpacity={0.5}
                >
                    <Image
                        style={{
                            height: 17,
                            resizeMode: 'contain',
                            tintColor: calendarThemeColor,
                        }}
                        source={require('./images/moveArrowLeft.png')}
                    />
                </TouchableOpacity>

                <Text
                    style={{
                        textAlign: 'center',
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: calendarThemeColor,
                    }}
                >{Moment(this.state.currentMoment).format((language === 'ko') ? 'YYYY[년] MM[월]' : 'MMM YYYY')}</Text>

                <TouchableOpacity //Right Arrow
                    style={{marginLeft: 40}}
                    hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                    onPress={this.onNext}
                    activeOpacity={0.5}
                >
                    <Image
                        style={{
                            height: 17,
                            resizeMode: 'contain',
                            tintColor: calendarThemeColor,
                        }}
                        source={require('./images/moveArrowRight.png')}
                    />
                </TouchableOpacity>

                {rightButton &&
                <TouchableOpacity
                    style={{
                        right: 26,
                        position: 'absolute',
                    }}
                    onPress={isRightEnabled ? onRightPress : () => {
                    }}
                    activeOpacity={isRightEnabled ? 0.2 : 1}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: isRightEnabled ? calendarThemeColor : calendarSubThemeColor,
                        }}
                    >
                        {rightButton}
                    </Text>
                </TouchableOpacity>
                }

            </View>
        );
    };

    renderHeadings = () => {
        const headings = [];
        const dayHeadings = this.props.dayHeadings;

        let i = 0;
        for (i; i < 7; ++i) {
            headings.push(
                <Text
                    style={{
                        color: this.props.calendarThemeColor,
                        fontSize: 16,
                    }}
                >
                    {dayHeadings[i]}
                </Text>,
            );
        }

        return (
            <View
                style={{
                    marginTop: 5,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                }}
            >
                {headings}
            </View>
        );

    };

    isSameDate = (currDate, date) => {
        return currDate.isSame(date, 'year') &&
            currDate.isSame(date, 'month') &&
            currDate.isSame(date, 'day');
    };

    isInArray = (date4Comparsion, array, startOrEnd) => {
        //0 - start
        //1 - end

        if (array.length === 0) {
            return false;
        }

        const formatMoment = date4Comparsion.format('YYYY-MM-DD');

        for (let i = 0; i < array.length; ++i) {
            if (array[i].start && array[i].end) {
                if (startOrEnd === 0 && formatMoment === array[i].start) {
                    return true;
                } else if (startOrEnd === 1 && formatMoment === array[i].end) {
                    return true;
                }
            } else {
                if (formatMoment === array[i]) {
                    return true;
                }
            }
        }
        return false;
    };

    isBetween = (currMoment, array) => {
        for (let i = 0; i < array.length; ++i) {
            if (currMoment.isBetween(array[i].start, Moment(array[i].end).add(1, 'day'))) {
                return true;
            }
        }
        return false;
    };

    isRangeExist = (array) => {
        if (array.length === 0) {
            return false;
        }

        for (let i = 0; i < array.length; ++i) {
            if (array[i].start && array[i].end) {
                return true;
            }
        }
        return false;
    };

    renderBody = () => {
        const {
            calendarThemeColor,
            calendarSubThemeColor,
            today,
            todayStyle,
            rangeEventColor,
            rangeEventDates,
            eventOneStyle,
            eventOneDates,
            eventTwoStyle,
            eventTwoDates,
            eventThreeStyle,
            eventThreeDates,
            weekStart,
            onDatePress,
            selectionStyle,
            rangeEventTextColor,
        } = this.props;

        let renderIndex = 0,
            weekRows = [],
            days = [];

        const
            curMoment = this.state.currentMoment,
            totalCells = 36,
            daysCount = curMoment.daysInMonth(),
            firstDate = Moment().year(curMoment.year()).month(curMoment.month()).date(1),
            firstDays = firstDate.days(),
            offset = (firstDays - weekStart + 7) % 7,
            isRangeValid = this.isRangeExist(rangeEventDates);

        do {
            const dayIndex = renderIndex - offset;
            const thisMoment = Moment(firstDate).add(dayIndex, 'day');
            const isMomentInBetween = this.isBetween(thisMoment, rangeEventDates);
            const isMomentOfThisMonth = (dayIndex >= 0 && dayIndex < daysCount);

            days.push(
                <View
                    style={[
                        styles.datesContainer,

                        isRangeValid &&
                        this.isInArray(thisMoment, rangeEventDates, 0) &&
                        {
                            borderTopLeftRadius: 50,
                            borderBottomLeftRadius: 50,
                            backgroundColor: rangeEventColor,
                        },

                        isRangeValid &&
                        this.isInArray(thisMoment, rangeEventDates, 1) &&
                        {
                            borderTopRightRadius: 50,
                            borderBottomRightRadius: 50,
                            backgroundColor: rangeEventColor,
                        },

                        isRangeValid &&
                        isMomentInBetween &&
                        {backgroundColor: rangeEventColor,},
                    ]}
                >

                    <TouchableOpacity
                        style={[
                            styles.individualDateContainer,

                            this.isInArray(thisMoment, eventOneDates) &&
                            eventOneStyle,

                            this.isSameDate(thisMoment, today) &&
                            todayStyle,

                            !isMomentOfThisMonth &&
                            {borderColor: calendarSubThemeColor},

                        ]}
                        onPress={() => {
                            this.setState({selectedMoment: thisMoment});
                            onDatePress && onDatePress(thisMoment);
                            !isMomentOfThisMonth && this.setState({currentMoment: thisMoment});
                        }}
                    >
                        <Text
                            style={[{
                                color: rangeEventTextColor && isMomentInBetween
                                    ? rangeEventTextColor : calendarThemeColor,
                                textAlign: 'center',
                                alignSelf: 'center',
                            },
                                !isMomentOfThisMonth &&
                                {color: calendarSubThemeColor},
                            ]}
                        >{thisMoment.format('D')}</Text>

                    </TouchableOpacity>

                    {this.isSameDate(thisMoment, this.state.selectedMoment) &&
                    <View style={selectionStyle}/>
                    }

                    {this.isInArray(thisMoment, eventThreeDates) &&
                    <View style={eventThreeStyle}/>
                    }

                    {this.isInArray(thisMoment, eventTwoDates) &&
                    <View style={eventTwoStyle}/>}

                </View>,
            );

            if (renderIndex % 7 === 6) {
                weekRows.push(
                    <View
                        style={{
                            justifyContent: 'space-around',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        {days}
                    </View>,
                );
                days = [];
                if (dayIndex + 1 >= totalCells) {
                    break;
                }
            }
            renderIndex++;
        } while (true);

        return (
            <View
                style={{}}
            >
                {weekRows}
            </View>
        );
    };

    renderBottomPart = () => {
        const legends = [];
        const titles = this.props.legendTitles;
        const figures = this.props.legendFigures;

        let i = 0;
        for (i; i < titles.length; ++i) {
            legends.push(
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    {figures[i]}
                    <Text style={{
                        color: this.props.calendarThemeColor,
                        marginLeft: 10,
                    }}>
                        {titles[i]}
                    </Text>
                </View>,
            );
        }

        return (
            <View>
                {titles.length !== 0 &&
                <View style={[
                    styles.paddedLineStyle,
                    {backgroundColor: this.props.calendarThemeColor,},
                ]}/>}

                <View style={styles.legendContainer}>
                    {legends}
                </View>
            </View>
        );
    };

    render() {
        return (

            <View style={this.props.calendarBackgroundStyle}>
                {this.renderTopBar()}
                {this.renderHeadings()}

                <View style={[
                    styles.lineStyle,
                    {backgroundColor: this.props.calendarThemeColor},
                ]}
                />

                {this.renderBody()}
                {this.renderBottomPart()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    lineStyle: {
        marginTop: 5,
        height: 1,
    },

    paddedLineStyle: {
        marginTop: 5,
        marginLeft: 20,
        marginRight: 20,
        height: 1,
    },

    topBarContainer: {
        marginTop: 5,
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 15,
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10,
    },

    datesContainer: {
        flex: 1,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
        marginBottom: 2,
    },

    individualDateContainer: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },

});