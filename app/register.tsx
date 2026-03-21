import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const { colors } = useTheme();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    const result = await register(username, email, password);
    setLoading(false);

    if (result.success) {
      setTimeout(() => router.replace('./home'), 100);
    } else {
      Alert.alert('Registration Failed', result.error || 'Unknown error');
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>

      {/* App Branding */}
      <View style={styles.container}>
        <Text style={[styles.logo, { color: colors.primary }]}>Habit Tracker</Text>

        {/* Registration Form */}
        <View style={styles.form}>
          <FormField
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="John Smith"
          />
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
            placeholder="Enter your password"
            secureTextEntry
          />
        </View>

        <PrimaryButton
          label={loading ? 'Registering new user...' : 'Register'}
          onPress={handleRegister}
          disabled={loading}
        />

        {/* Footer with navigation to Login */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Already have an account?{' '}
          </Text>
          <Text
            style={[styles.link, { color: colors.primary }]}
            onPress={() => router.replace('/')}
          >
            Log in
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  logo: { fontSize: 36, fontWeight: '800', textAlign: 'center', marginBottom: 40 },
  form: { marginBottom: 8 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { fontSize: 14 },
  link: { fontSize: 14, fontWeight: '700' },
});