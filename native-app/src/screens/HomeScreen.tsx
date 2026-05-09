import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { ArrowRight, Zap, Shield, Navigation } from 'lucide-react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <Animated.View 
          entering={FadeInDown.delay(200).duration(1000)}
          style={styles.hero}
        >
          <View style={styles.header}>
             <Image 
              source={require('../../assets/logo2.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>
              Welcome to <Text style={styles.brandJeff}>JEFF</Text>
              <Text style={styles.brandBen}>BEN</Text> Systems
            </Text>
            <Text style={styles.heroSubtitle}>
              Pioneering Intelligence in Metropolitan Public Transit Ecosystems
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.ctaButton}
            activeOpacity={0.8}
            onPress={handlePress}
          >
            <Text style={styles.ctaText}>Explore Solutions</Text>
            <ArrowRight size={20} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        {/* Feature Grid */}
        <View style={styles.features}>
          <FeatureCard 
            icon={<Zap size={24} color="#EA580C" />}
            title="Real-time Tracking"
            description="Live GPS telemetry for the entire metropolitan fleet."
          />
          <FeatureCard 
            icon={<Shield size={24} color="#EA580C" />}
            title="Secure Payments"
            description="End-to-end encrypted ticketing and transactions."
          />
          <FeatureCard 
            icon={<Navigation size={24} color="#EA580C" />}
            title="Route Intelligence"
            description="Dynamic route optimization and traffic analysis."
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 JEFFBEN SYSTEMS</Text>
          <Text style={styles.footerSub}>Industrial-Grade Transit Automation</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <Animated.View 
      entering={FadeInUp.delay(400).duration(800)}
      style={styles.featureCard}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 60,
  },
  hero: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 60,
    alignItems: 'center',
  },
  heroTextContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#000',
    textAlign: 'center',
    lineHeight: 50,
    letterSpacing: -1,
  },
  brandJeff: {
    color: '#000',
  },
  brandBen: {
    color: '#EA580C',
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#4b5563',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '500',
    lineHeight: 26,
  },
  ctaButton: {
    backgroundColor: '#000',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  ctaText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  features: {
    paddingHorizontal: 24,
    gap: 20,
  },
  featureCard: {
    backgroundColor: '#f9fafb',
    padding: 30,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 22,
    fontWeight: '500',
  },
  footer: {
    marginTop: 60,
    alignItems: 'center',
    opacity: 0.5,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 3,
  },
  footerSub: {
    fontSize: 10,
    color: '#4b5563',
    marginTop: 8,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
