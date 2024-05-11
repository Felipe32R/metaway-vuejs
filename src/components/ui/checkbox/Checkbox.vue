<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Check } from 'lucide-vue-next'
import type { CheckboxRootEmits, CheckboxRootProps } from 'radix-vue'
import { CheckboxIndicator, CheckboxRoot, useForwardPropsEmits } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<CheckboxRootProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<CheckboxRootEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <CheckboxRoot
    v-bind="forwarded"
    :class="
      cn('peer h-4 w-4 shrink-0 rounded-sm border border-indigo-200 border-indigo-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-indigo-900 data-[state=checked]:text-indigo-50 dark:border-indigo-800 dark:border-indigo-50 dark:ring-offset-indigo-950 dark:focus-visible:ring-indigo-300 dark:data-[state=checked]:bg-indigo-50 dark:data-[state=checked]:text-indigo-900',
         props.class)"
  >
    <CheckboxIndicator class="flex h-full w-full items-center justify-center text-current">
      <slot>
        <Check class="h-4 w-4" />
      </slot>
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
