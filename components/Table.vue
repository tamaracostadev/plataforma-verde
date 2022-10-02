<template>
  <div class="mt-5 w-full">
          <table class="table-auto border-collapse w-full bg-white">
            <thead class="text-pvsm bg-tblhead">
              <tr class="h-10 text-left">
                <th class="p-2 border border-divider">NOME COMPLETO</th>
                <th class="p-2 border border-divider">CPF</th>
                <th class="p-2 border border-divider">DATA DE NASCIMENTO</th>
                <th class="p-2 border border-divider">IDADE</th>
                <th class="p-2 border border-divider">ESTADO</th>
                <th class="p-2 border border-divider">CIDADE</th>
                <th class="p-2 border border-divider">EDITAR</th>
                <th class="p-2 border border-divider">EXCLUIR</th>
              </tr>
            </thead>
            <tbody>
              <tr  v-for="(user,i) in users" :key="'user'+i" class="text-xs h-10 hover:bg-form">
                <td class="p-2 border border-divider">{{user.nome}}</td>
                <td class="p-2 border border-divider">{{user.cpf}}</td>
                <td class="p-2 border border-divider">{{user.dtNasc}}</td>
                <td class="p-2 border border-divider">{{user.idade}}</td>
                <td class="p-2 border border-divider">{{user.estado}}</td>
                <td class="p-2 border border-divider">{{user.cidade}}</td>
                <td class="border border-divider"><img src="~/static/icon-pencil.svg" class="mx-auto cursor-pointer" @click="editUser(i)"></td>
                <td class="border border-divider"><img src="~/static/icon-trash.svg" class="mx-auto cursor-pointer" @click="deletaUser(i)"></td>
              </tr>
            </tbody>
          </table>
        </div>
</template>

<script>
export default {
    name: 'Table',
    props: ['usersList'],

    computed:{
        users(){return this.usersList},
    },
    methods:{
        deletaUser(id){
            this.users.splice(id, 1)
        },
        editUser(id){
            this.$root.$emit('edit',id)
        }

    }
}
</script>
