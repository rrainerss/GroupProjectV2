import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../../colors';

type WideCardProps = {
  title: string;
  description: string;
  letter: string;
  imageSrc: string;
  accentColor: string;
  onPress?: () => void;
};

const WideCard = ({ 
  title, 
  description, 
  letter, 
  imageSrc,
  accentColor,
  onPress
}: WideCardProps) => {
  return (
    <TouchableOpacity style={styles.cardBody} onPress={onPress}>
      <View style={styles.leftSide}>
        <View style={[styles.circleIcon, { backgroundColor: accentColor }]}>
          <Text style={styles.circleIconText}>{letter}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.description} numberOfLines={1}>{description}</Text>
        </View>
      </View>
      <View style={styles.rightSide}>
        <View style={styles.imagePlaceholder}>
          <Image 
            source={{ uri: imageSrc }}
            style={[styles.imagePlaceholder, { backgroundColor: accentColor }]}
            resizeMode="cover"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardBody: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 10,
    height: 80,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  leftSide: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    padding: 10,
    overflow: 'hidden',
  },
  circleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  circleIconText: {
    color: 'white',
    fontSize: 20,
  },
  textContainer: {
    justifyContent: 'center',
    flexShrink: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  description: {
    fontSize: 12,
    color: 'gray',
  },
  rightSide: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  imageText: {
    color: 'white',
  },
});

export default WideCard;
