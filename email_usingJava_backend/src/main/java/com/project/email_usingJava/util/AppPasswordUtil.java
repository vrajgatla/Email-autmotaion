package com.project.email_usingJava.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class AppPasswordUtil {
    private static final String SECRET_KEY = "MySuperSecretKey"; // 16 chars = 16 bytes. Use env variable in production
    private static final String ALGORITHM = "AES";
    private static final BCryptPasswordEncoder bCrypt = new BCryptPasswordEncoder();

    public static String encrypt(String value) {
        try {
            SecretKeySpec key = new SecretKeySpec(SECRET_KEY.getBytes(), ALGORITHM);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, key);
            byte[] encrypted = cipher.doFinal(value.getBytes());
            return Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            throw new RuntimeException("Error encrypting value", e);
        }
    }

    public static String decrypt(String encryptedValue) {
        try {
            SecretKeySpec key = new SecretKeySpec(SECRET_KEY.getBytes(), ALGORITHM);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, key);
            byte[] decoded = Base64.getDecoder().decode(encryptedValue);
            byte[] decrypted = cipher.doFinal(decoded);
            return new String(decrypted);
        } catch (Exception e) {
            throw new RuntimeException("Error decrypting value", e);
        }
    }

    public static String hash(String value) {
        return bCrypt.encode(value);
    }

    public static boolean matches(String raw, String hashed) {
        return bCrypt.matches(raw, hashed);
    }
} 