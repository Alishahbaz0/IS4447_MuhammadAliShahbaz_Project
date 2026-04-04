import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Default screen — login form
export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const { colors } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      setTimeout(() => router.replace('/(tabs)'), 100);
    } else {
      Alert.alert('Login failed', result.error || 'Unknown error');
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      
      {/* App Branding */}
      <View style={styles.container}>
        <Text style={[styles.logo, { color: colors.primary }]}>Habit Tracker</Text>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>
          by Muhammad Ali Shahbaz
        </Text>

        {/* Login Form */}
        <View style={styles.form}>
          <FormField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="johnsmith@example.com"
            keyboardType="email-address"
            autoCapitilize="none"
          />
          <FormField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Your password"
            secureTextEntry
          />
        </View>

        <PrimaryButton
          label={loading ? 'Logging in...' : 'Log In'}
          onPress={handleLogin}
          disabled={loading}
        />

        {/* Footer with navigation to Register */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Don't have an account?{' '}
          </Text>
          <Text
            style={[styles.link, { color: colors.primary }]}
            onPress={() => router.push('/register')}
          >
            Sign Up
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  logo: { fontSize: 36, fontWeight: '800', textAlign: 'center' },
  tagline: { fontSize: 15, textAlign: 'center', marginTop: 8, marginBottom: 40 },
  form: { marginBottom: 8 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { fontSize: 14 },
  link: { fontSize: 14, fontWeight: '700' },
});