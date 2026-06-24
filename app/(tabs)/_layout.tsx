import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { colors, fontSizes } from '../../src/styles/tokens'

type IoniconsName = React.ComponentProps<typeof Ionicons>['name']

function TabIcon({ name, focused }: { name: IoniconsName; focused: boolean }) {
  return <Ionicons name={name} size={22} color={focused ? colors.primary : colors.muted} />
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 64,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: fontSizes.xs, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: '首页',
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: '学一点',
          tabBarIcon: ({ focused }) => <TabIcon name="checkbox-outline" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="scenes"
        options={{
          title: '场景',
          tabBarIcon: ({ focused }) => <TabIcon name="heart-outline" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="cabin"
        options={{
          title: '小窝',
          tabBarIcon: ({ focused }) => <TabIcon name="person-outline" focused={focused} />,
        }}
      />
    </Tabs>
  )
}
