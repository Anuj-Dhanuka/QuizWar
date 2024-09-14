import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';

//dimension utils
import { normalize, scaleVertical } from '../../utils/DimensionUtils';

//font utils
import { getInterFont } from '../../utils/FontUtils/interFontHelper';

const HomeScreen = ({ navigation }) => {
    const [streak, setStreak] = useState(5);
    const [totalPoints, setTotalPoints] = useState(1200);
    const [quizzesCompleted, setQuizzesCompleted] = useState(15);

    const userStats = [
        { id: '1', title: 'Streak', value: `${streak} Days` },
        { id: '2', title: 'Total Points', value: `${totalPoints}` },
        { id: '3', title: 'Quizzes Completed', value: `${quizzesCompleted}` },
    ];

    const completeQuiz = () => {
        setStreak(streak + 1);
        setTotalPoints(totalPoints + 100);
        setQuizzesCompleted(quizzesCompleted + 1);
    };

    const renderStatItem = ({ item }) => (
        <View style={styles.statCard}>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statTitle}>{item.title}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#6a11cb" barStyle="light-content" />
            <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.container}>
                {/* User Stats Carousel */}
                <View style={styles.userStatsContainer}>
                    <FlatList 
                        data={userStats}
                        renderItem={renderStatItem}
                        keyExtractor={item => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.statsList}
                    />
                </View>

                <Text style={styles.welcomeText}>Welcome to Quiz War</Text>
                <Text style={styles.subHeroText}>Test your knowledge and win rewards!!!</Text>

                {/* Floating Play Now Button */}
                <TouchableOpacity 
                    style={styles.floatingPlayButton}
                    onPress={() => {
                        navigation.navigate('QuizCategoriesScreen');
                    }}
                >
                    <Text style={styles.playNowText}>Play Now</Text>
                </TouchableOpacity>

                {/* Swipeable Tournaments Section */}
                <View style={styles.tournaments}>
                    <Text style={styles.sectionTitle}>Featured Tournaments</Text>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={[
                            { id: '1', title: 'Weekly Challenge', details: 'Ends in 3 days' },
                            { id: '2', title: 'Monthly Marathon', details: 'Ends in 20 days' }
                        ]}
                        renderItem={({ item }) => (
                            <View style={styles.tournamentCard}>
                                <Text style={styles.tournamentTitle}>{item.title}</Text>
                                <Text style={styles.tournamentDetails}>{item.details}</Text>
                                <TouchableOpacity style={styles.joinButton}>
                                    <Text style={styles.joinButtonText}>Play Now</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        keyExtractor={item => item.id}
                    />
                </View>

                {/* Animated Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.footerButton}>
                        <Icon name="user" size={28} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerButton}>
                        <Icon name="trophy" size={28} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerButton}>
                        <Icon name="cog" size={28} color="#fff" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    userStatsContainer: {
        paddingTop: scaleVertical(60),
        paddingBottom: scaleVertical(20),
    },
    statsList: {
        paddingLeft: normalize(20),
    },
    statCard: {
        backgroundColor: '#ffffff50',
        borderRadius: normalize(15),
        padding: normalize(20),
        marginRight: normalize(15),
        alignItems: 'center',
        minWidth: normalize(120),
    },
    statValue: {
        fontSize: normalize(24),
        fontWeight: 'bold',
        color: '#fff',
    },
    statTitle: {
        fontSize: normalize(16),
        color: '#ddd',
        marginTop: scaleVertical(5),
    },
    welcomeText: {
        color: "#FFF",
        alignSelf: "center",
        ...getInterFont("Bold"),
        fontSize: normalize(24),
        marginTop: scaleVertical(70)
    },
    subHeroText: {
        fontSize: normalize(16),
        color: '#FFF',
        textAlign: 'center',
        marginTop: scaleVertical(10),
        ...getInterFont("Medium")
    },
    floatingPlayButton: {
        position: 'absolute',
        bottom: '50%',
        alignSelf: 'center',
        paddingVertical: scaleVertical(20),
        paddingHorizontal: normalize(60),
        backgroundColor: '#ff5f6d',
        borderRadius: normalize(50),
        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowRadius: normalize(10),
        shadowOffset: { width: normalize(0), height: scaleVertical(5) },
        elevation: 10,
        zIndex: 10,
    },
    playNowText: {
        color: '#fff',
        fontSize: normalize(24),
        fontWeight: 'bold',
    },
    tournaments: {
        position: 'absolute',
        bottom: '15%',
        width: '100%',
        paddingLeft: normalize(20),
    },
    sectionTitle: {
        fontSize: normalize(24),
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: scaleVertical(10),
    },
    tournamentCard: {
        backgroundColor: '#ffffff90',
        borderRadius: normalize(20),
        padding: normalize(20),
        marginRight: normalize(15),
        minWidth: normalize(200),
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: normalize(10),
        shadowOffset: { width: normalize(0), height: scaleVertical(5) },
        elevation: 5,
    },
    tournamentTitle: {
        fontSize: normalize(18),
        fontWeight: 'bold',
        color: '#333',
    },
    tournamentDetails: {
        fontSize: normalize(14),
        color: '#666',
        marginTop: scaleVertical(5),
    },
    joinButton: {
        marginTop: scaleVertical(10),
        paddingVertical: scaleVertical(10),
        paddingHorizontal: normalize(20),
        backgroundColor: '#ff5f6d',
        borderRadius: normalize(30),
    },
    joinButtonText: {
        color: '#fff',
        fontSize: normalize(16),
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: scaleVertical(15),
        backgroundColor: '#00000060',
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    footerButton: {
        alignItems: 'center',
    },
});

export default HomeScreen;
