<template>
  <div class="w-full h-full">
    <Navbar/>
    <div class="px-10 mx-auto">
      <!-- Title Cadastro usuário -->
      <div class="flex items-center justify-between mt-9 border-b-2 border-b-divider">
        <div class="flex items-center gap-2.5 mb-2.5">
          <img src="~/static/icon.svg">
          <h1 class="text-2xl text-title">Cadastro Usuário</h1>
          <div class="w-4 h-4 mt-1 rounded-full border-2 border-divider relative">
            <p class="text-divider text-pvsm absolute left-[4px] top-[-3px]">i</p>
          </div>
        </div>
        <p class="self-end text-pvsm ">*campos obrigatórios</p>
      </div>
      <!-- Component form -->
      <div class="bg-form mt-5 rounded shadow-box">
        <div class="w-full p-2.5">
          <form class="grid grid-cols-12" @submit.prevent="addUser()" >
            <!-- Linha1 -->
            <div class="col-start-1 col-end-8">
              <label for="nome">Nome Completo*</label>
              <input type="text" name="nome">
            </div>
            <div class="col-start-1 col-end-8">
              <label for="cpf">CPF*</label>
              <input type="text" name="cpf" placeholder="000.000.000-00">
            </div>
            <div class="col-start-1 col-end-8">
              <label for="dtNasc">Data de Nascimento*</label>
              <input type="date" name="dtNasc" placeholder="00/00/0000">
            </div>
            <!-- Linha2 -->
            <div class="col-start-1 col-end-8">
              <label for="estado">Estado*</label>
              <select name="estado">
                <option value="" selected>Selecione</option>
              </select>
            </div>
            <div class="col-start-1 col-end-8">
              <label for="cidade">Cidade*</label>
              <select name="cidade">
                <option value="" selected>Selecione</option>
              </select>
            </div>
            <div class="col-start-1 col-end-8">
              <button type="submit">Incluir</button>
            </div>
          </form>
        </div>
        <div class="p-2.5 w-full">
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
              <tr  v-for="(user,i) in users" :key="'user'+i" class="text-xs h-10">
                <td class="p-2 border border-divider">{{user.nome}}</td>
                <td class="p-2 border border-divider">{{user.cpf}}</td>
                <td class="p-2 border border-divider">{{user.dtNasc}}</td>
                <td class="p-2 border border-divider">{{user.idade}}</td>
                <td class="p-2 border border-divider">{{user.estado}}</td>
                <td class="p-2 border border-divider">{{user.cidade}}</td>
                <td class="border border-divider"><img src="~/static/icon-pencil.svg" class="mx-auto"></td>
                <td class="border border-divider"><img src="~/static/icon-trash.svg" class="mx-auto"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Component table -->

    </div>
  </div>
</template>

<script>
import Navbar from '~/components/Navbar.vue';
export default {
  name: "IndexPage",
  components: { Navbar },
  data(){
    return {
      users: [
      {
        nome: "Tamara",
        cpf: "404.193.938-03",
        dtNasc: "05/10/1991",
        idade: "30",
        estado: "SP",
        cidade: "Santo André"
      }
      ],
      form: {
        nome: "",
        cpf: "",
        dtNasc: "",
        idade: "",
        estado: "",
        cidade: ""
      },
    }
  },
  methods: {
    addUser() {
      this.users.push(this.form)
    }
  },   
}
</script>
