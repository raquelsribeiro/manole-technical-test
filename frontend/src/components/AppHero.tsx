import { Badge, Group, Paper, Stack, Text, Title } from "@mantine/core";

export const AppHero = () => {
  return (
    <Paper className="hero-panel" radius="md">
      <Group justify="space-between" align="flex-end" gap="lg">
        <Stack gap="xs">
          <Badge variant="light" color="indigo">
            <Group gap={6}>Manole Technical Test</Group>
          </Badge>
          <Title className="hero-title">Gerenciador de tarefas</Title>
          <Text className="hero-subtitle">
            Organize, filtre e acompanhe tarefas.
          </Text>
        </Stack>
      </Group>
    </Paper>
  );
};
