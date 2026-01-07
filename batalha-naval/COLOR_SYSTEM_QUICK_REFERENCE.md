# Quick Reference - Color System Usage

## 🎨 Most Common Use Cases

### 1. Screen Background
```typescript
container: {
  flex: 1,
  backgroundColor: Colors.bgDark, // #1a1a2e
  padding: Spacing.lg, // 20px
}
```

### 2. Section/Card Background
```typescript
card: {
  backgroundColor: Colors.bgMedium, // #16213e
  padding: 20,
  borderRadius: BorderRadius.md, // 10px
  borderWidth: 1,
  borderColor: Colors.border, // #4da6ff
}
```

### 3. Text on Dark Background
```typescript
title: {
  fontSize: 24,
  fontWeight: 'bold',
  color: Colors.textPrimary, // #FFFFFF - ALWAYS use for titles
  textAlign: 'center',
}

subtitle: {
  fontSize: 16,
  color: Colors.textSecondary, // #E0E0E0 - Good for body text
}

hint: {
  fontSize: 14,
  color: Colors.textMuted, // #999999 - Only for hints/disabled
}
```

### 4. Primary Button
```typescript
import { Buttons } from '../styles/common';

button: {
  ...Buttons.primary, // Includes all styling + shadows
  // Override only if needed:
  paddingVertical: 20,
}

buttonText: {
  color: Colors.textPrimary,
  fontSize: 18,
  fontWeight: 'bold',
}
```

### 5. Success/Error Buttons
```typescript
successButton: {
  ...Buttons.success, // Green button
}

dangerButton: {
  ...Buttons.danger, // Red button
}
```

### 6. Input Field
```typescript
input: {
  backgroundColor: Colors.bgLight, // #0f3460
  color: Colors.textPrimary, // #FFFFFF
  padding: 15,
  borderRadius: BorderRadius.md,
  fontSize: 16,
  borderWidth: 2,
  borderColor: Colors.border,
}
```

### 7. Status Indicators
```typescript
// Success state
successBox: {
  backgroundColor: 'rgba(92, 184, 92, 0.2)',
  borderColor: Colors.success, // #5cb85c
  borderWidth: 2,
}

// Error state
errorBox: {
  backgroundColor: 'rgba(217, 83, 79, 0.2)',
  borderColor: Colors.error, // #d9534f
  borderWidth: 2,
}

// Warning state
warningBox: {
  backgroundColor: 'rgba(240, 173, 78, 0.2)',
  borderColor: Colors.warning, // #f0ad4e
  borderWidth: 2,
}
```

### 8. Info/Help Text
```typescript
infoText: {
  fontSize: 14,
  color: Colors.info, // #5bc0de - Light blue for info
}
```

---

## 🎮 Game-Specific Colors

### Board Cells
```typescript
// Water (empty cell)
{ backgroundColor: Colors.water } // #4a90e2 - Vibrant blue

// Ship (healthy)
{ backgroundColor: Colors.shipHealthy } // #34495e - Dark gray

// Ship during placement
{ backgroundColor: Colors.shipPlacement } // #2ecc71 - Green

// Ship hit
{ backgroundColor: Colors.shipHit } // #e74c3c - Red

// Ship sunk
{ backgroundColor: Colors.shipSunk } // #c0392b - Dark red

// Water hit (miss)
{ backgroundColor: Colors.waterHit } // #95a5a6 - Gray
```

---

## 📏 Spacing Guide

```typescript
import { Spacing } from '../styles/common';

// Use predefined spacing
padding: Spacing.xs,  // 5px
padding: Spacing.sm,  // 10px
padding: Spacing.md,  // 15px
padding: Spacing.lg,  // 20px - Most common
padding: Spacing.xl,  // 30px
padding: Spacing.xxl, // 40px
```

---

## 🔲 Border Radius Guide

```typescript
import { BorderRadius } from '../styles/common';

borderRadius: BorderRadius.sm,    // 5px
borderRadius: BorderRadius.md,    // 10px - Most common
borderRadius: BorderRadius.lg,    // 15px
borderRadius: BorderRadius.xl,    // 20px
borderRadius: BorderRadius.round, // 999px (fully rounded)
```

---

## 🌑 Shadow Guide

```typescript
import { Shadows } from '../styles/common';

// Small shadow (subtle)
...Shadows.small,

// Medium shadow (cards)
...Shadows.medium,

// Large shadow (buttons)
...Shadows.large,
```

---

## ⚠️ Common Mistakes to Avoid

### ❌ DON'T DO THIS:
```typescript
// Hardcoded colors
color: '#FFF',
backgroundColor: '#1E3A5F',

// Dark text on dark background
color: '#333',

// Inconsistent spacing
padding: 17,

// Magic numbers
borderRadius: 9,
```

### ✅ DO THIS:
```typescript
// Use Colors
color: Colors.textPrimary,
backgroundColor: Colors.bgDark,

// White/light text on dark background
color: Colors.textPrimary, // or Colors.textSecondary

// Use predefined spacing
padding: Spacing.lg,

// Use predefined border radius
borderRadius: BorderRadius.md,
```

---

## 🎯 Complete Example

```typescript
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '../styles/colors';
import { Typography, Buttons, Spacing, BorderRadius, Shadows } from '../styles/common';

export default function ExampleScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Screen Title</Text>
      <Text style={styles.subtitle}>Screen Subtitle</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Card Title</Text>
        <Text style={styles.cardText}>Card body text</Text>
        
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Primary Button</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
    padding: Spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.info,
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    backgroundColor: Colors.bgMedium,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
    ...Shadows.medium,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 20,
  },
  button: {
    ...Buttons.primary,
  },
  buttonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

---

## 🔍 Finding the Right Color

**Need to show text?**
- Important text → `Colors.textPrimary` (#FFFFFF)
- Normal text → `Colors.textSecondary` (#E0E0E0)
- Hint/disabled → `Colors.textMuted` (#999999)
- Info/links → `Colors.info` (#5bc0de)

**Need a background?**
- Main screen → `Colors.bgDark` (#1a1a2e)
- Card/section → `Colors.bgMedium` (#16213e)
- Input/interactive → `Colors.bgLight` (#0f3460)

**Need a button?**
- Main action → `Colors.primary` (#4da6ff)
- Success → `Colors.success` (#5cb85c)
- Danger → `Colors.error` (#d9534f)
- Warning → `Colors.warning` (#f0ad4e)

**Need game colors?**
- Water → `Colors.water` (#4a90e2)
- Ship → `Colors.shipHealthy` (#34495e)
- Hit → `Colors.shipHit` (#e74c3c)
- Miss → `Colors.waterHit` (#95a5a6)

---

## 📱 Testing Your Changes

1. Always test text on the actual background
2. Check at different brightness levels
3. Verify buttons have proper feedback
4. Ensure shadows are visible
5. Test on both Android and iOS if possible

---

**Quick Tip**: When in doubt, use `Colors.textPrimary` for text and `Colors.bgDark` for backgrounds!
