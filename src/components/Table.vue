<template>
  <table class="min-w-full divide-y divide-gray-200">
    <thead>
      <tr>
        <th v-for="column in columns" :key="column.key" class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
          {{ column.label }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row.id" class="bg-white">
        <td v-for="column in columns" :key="column.key" class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
          {{ row[column.key] }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    columns: {
      type: Array,
      required: true
    },
    rows: {
      type: Array,
      required: true
    }
  }
};
</script>