<script setup lang="ts">
import { ref } from 'vue'
import { NInputNumber, NSelect, NSwitch, NButton, NSpace, NTag, useMessage } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/hermes/settings'
import { useSessionBrowserPrefsStore } from '@/stores/hermes/session-browser-prefs'
import { syncSessionsFromCli } from '@/api/hermes/sessions'
import SettingRow from './SettingRow.vue'

const settingsStore = useSettingsStore()
const sessionBrowserPrefsStore = useSessionBrowserPrefsStore()
const message = useMessage()
const { t } = useI18n()

const syncing = ref(false)

async function save(values: Record<string, any>) {
  try {
    await settingsStore.saveSection('session_reset', values)
    message.success(t('settings.saved'))
  } catch (err: any) {
    message.error(t('settings.saveFailed'))
  }
}

async function handleSyncFromCli() {
  syncing.value = true
  try {
    const result = await syncSessionsFromCli()
    message.success(
      t('settings.session.syncComplete', {
        synced: result.synced,
        updated: result.updated,
        errors: result.errors,
      }),
    )
  } catch (err: any) {
    message.error(t('settings.session.syncFailed'))
  } finally {
    syncing.value = false
  }
}
</script>

<template>
  <section class="settings-section">
    <SettingRow :label="t('settings.session.mode')" :hint="t('settings.session.modeHint')">
      <NSelect
        :value="settingsStore.sessionReset.mode || 'both'"
        :options="[
          { label: t('settings.session.modeBoth'), value: 'both' },
          { label: t('settings.session.modeIdle'), value: 'idle' },
          { label: t('settings.session.modeHourly'), value: 'hourly' },
        ]"
        size="small" class="input-md"
        @update:value="v => save({ mode: v })"
      />
    </SettingRow>
    <SettingRow :label="t('settings.session.idleMinutes')" :hint="t('settings.session.idleMinutesHint')">
      <NInputNumber
        :value="settingsStore.sessionReset.idle_minutes"
        :min="10" :max="10080" :step="30"
        size="small" class="input-sm"
        @update:value="v => v != null && save({ idle_minutes: v })"
      />
    </SettingRow>
    <SettingRow :label="t('settings.session.atHour')" :hint="t('settings.session.atHourHint')">
      <NInputNumber
        :value="settingsStore.sessionReset.at_hour"
        :min="0" :max="23" :step="1"
        size="small" class="input-sm"
        @update:value="v => v != null && save({ at_hour: v })"
      />
    </SettingRow>
    <SettingRow :label="t('settings.session.liveMonitorHumanOnly')" :hint="t('settings.session.liveMonitorHumanOnlyHint')">
      <NSwitch
        :value="sessionBrowserPrefsStore.humanOnly"
        @update:value="value => sessionBrowserPrefsStore.setHumanOnly(value)"
      />
    </SettingRow>
    <SettingRow :label="t('settings.session.syncFromCli')" :hint="t('settings.session.syncFromCliHint')">
      <NButton
        type="primary"
        size="small"
        :loading="syncing"
        :disabled="syncing"
        @click="handleSyncFromCli"
      >
        {{ t('settings.session.syncFromCliAction') }}
      </NButton>
    </SettingRow>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.settings-section {
  margin-top: 16px;
}
</style>
