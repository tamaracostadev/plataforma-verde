<template>
  <div class="w-full h-full">
    <Navbar />
    <div class="px-10 mx-auto">
      <!-- Title Cadastro usuário -->
      <div
        class="flex items-center justify-between mt-9 border-b-2 border-b-divider"
      >
        <div class="flex items-center gap-2.5 mb-2.5">
          <img src="~/static/icon.svg" />
          <h1 class="text-2xl text-title">Cadastro Usuário</h1>
          <div
            class="w-4 h-4 mt-1 rounded-full border-2 border-divider relative"
          >
            <p class="text-divider text-pvsm absolute left-[4px] top-[-3px]">
              i
            </p>
          </div>
        </div>
        <p class="self-end text-pvsm">*campos obrigatórios</p>
      </div>
      <!-- Component form -->
      <div class="bg-form mt-5 rounded shadow-box">
        <div class="w-full p-2.5">
          <form
            id="form-user"
            class="grid grid-cols-12 gap-3 w-full text-pvsm"
            @submit.prevent="edit?updateUser() :addUser()"
          >
            <!-- Linha1 -->
            <div class="col-start-1 col-end-8 w-full">
              <label for="nome">Nome Completo*</label>
              <input
                v-model="form.nome"
                class="w-full p-1 rounded border-2 border-divider"
                type="text"
                name="nome"
                required
              />
            </div>
            <div class="col-start-8 col-end-11">
              <label for="cpf">CPF*</label>
              <input
                v-model="form.cpf"
                v-mask="'###.###.###-##'"
                class="w-full p-1 rounded border-2 border-divider"
                type="text"
                name="cpf"
                placeholder="000.000.000-00"
                required
              />
              <p v-if="errors.cpf" class="text-red-600">{{ errors.cpf }}</p>
            </div>
            <div class="col-start-11 col-end-13">
              <label for="dtNasc">Data de Nascimento*</label>
              <input
                v-model="form.dtNasc"
                class="w-full p-1 rounded border-2 border-divider"
                type="date"
                name="dtNasc"
                required
              />
            </div>
            <!-- Linha2 -->
            <div class="col-start-1 col-end-6">
              <label for="estado">Estado*</label>
              <select
                v-model="form.estado"
                class="w-full p-1.5 rounded border-2 border-divider"
                name="estado"
                required
                @change="fetchCidades(form.estado)"
              >
                <option value="" selected disabled>Selecione</option>
                <option
                  v-for="(estado, i) in estados"
                  :key="'estado' + i"
                  :value="estado.id"
                >
                  {{ estado.nome }}
                </option>
              </select>
            </div>
            <div class="col-start-6 col-end-11">
              <label for="cidade">Cidade*</label>
              <select
                v-model="form.cidade"
                class="w-full p-1.5 rounded border-2 border-divider"
                name="cidade"
                required
              >
                <option value="" selected disabled>Selecione</option>
                <option
                  v-for="(cidade, i) in cidades"
                  :key="'cidade' + i"
                  :value="cidade.id"
                >
                  {{ cidade.nome }}
                </option>
              </select>
            </div>
            <div class="col-start-11 col-end-13 self-end">
              <button
                type="submit"
                class="w-full p-1 rounded border-2 border-btn bg-btn text-white hover:bg-btnh"
              >
                <span class="flex items-center justify-center gap-1.5"
                  ><img src="~/static/icon-arrow.svg" />{{edit?'EDITAR':'INCLUIR'}}</span
                >
              </button>
            </div>
          </form>
        </div>
        <Table :users-list="users" @modal="edit = true" @edit-user="editUser($event)" />
      </div>

      <!-- Component table -->
    </div>
  </div>
</template>

<script>
import Table from '../components/Table.vue';
import Navbar from '~/components/Navbar.vue';

export default {
  name: 'IndexPage',
  components: { Navbar, Table },
  data() {
    return {
      users: [
        {
          nome: 'Tamara',
          cpf: '404.193.938-03',
          dtNasc: '05/10/1991',
          idade: '30',
          estado: 'SP',
          cidade: 'Santo André',
        },
      ],
      form: {
        id:'',
        nome: '',
        cpf: '',
        dtNasc: '',
        estado: '',
        cidade: '',
      },
      cidades: [],
      estados: [],
      errors: {
        cpf: '',
      },

      edit: false,
      urlEstados:'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome',
    };
  },
  async fetch() {
    this.estados = await this.$axios.$get(this.urlEstados);
  },
  methods: {
    async fetchCidades(estado) {
      const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios?orderBy=nome`;
      const cidades = await this.$axios.$get(url);
      this.cidades = cidades;
    },

    addUser() {
      this.errors.cpf = '';
      if (!this.validaCpf(this.form.cpf)) {
        this.errors.cpf = 'CPF inválido';
        return;
      }
      const user = {
        nome: this.form.nome,
        cpf: this.form.cpf,
        dtNasc: this.formataData(this.form.dtNasc),
        idade: this.calculaIdade(this.form.dtNasc),
        estado: this.estados.find(uf => uf.id == this.form.estado).sigla,
        cidade: this.cidades.find(mun => mun.id == this.form.cidade).nome,
      };
      this.users.push(user);
      this.limpaForm();
    },

    async editUser(idUser){
      const user = this.users[idUser];
      const estado = this.estados.find(uf => uf.sigla == user.estado);
      await this.fetchCidades(estado.id);
      const cidade = this.cidades.find(mun => mun.nome == user.cidade)
      this.form = {
        id: idUser,
        nome: user.nome,
        cpf: user.cpf,
        dtNasc: user.dtNasc.split('/').reverse().join('-'),
        estado: estado.id,
        cidade: cidade.id,
      }
      
    },
    updateUser(){
      this.errors.cpf = '';
      if (!this.validaCpf(this.form.cpf)) {
        this.errors.cpf = 'CPF inválido';
        return;
      }
      const id = this.form.id
      this.users[id].nome = this.form.nome
      this.users[id].cpf = this.form.cpf
      this.users[id].dtNasc = this.formataData(this.form.dtNasc)
      this.users[id].idade = this.calculaIdade(this.form.dtNasc)
      this.users[id].estado = this.estados.find(uf => uf.id == this.form.estado).sigla
      this.users[id].cidade = this.cidades.find(mun => mun.id == this.form.cidade).nome
      
      this.limpaForm();
      this.edit = false;
    },

    calculaIdade(dtNasc) {
      const hoje = new Date();
      const nasc = new Date(dtNasc);
      let diffAnos = hoje.getFullYear() - nasc.getFullYear();
      if (
        new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()) <
        new Date(hoje.getFullYear(), nasc.getMonth(), nasc.getDate())
      ){
        diffAnos--;
      }

      return diffAnos;
    },


    formataData(data) {
      const date = new Date(data);
      date.setTime( date.getTime() + date.getTimezoneOffset()*60*1000 );
      return Intl.DateTimeFormat('pt-br').format(date);
    },

    limpaForm(){
      this.form = {
        id:'',
        nome: '',
        cpf: '',
        dtNasc: '',
        estado: '',
        cidade: '',
      }
      this.cidades = []
    },


    validaCpf(cpf) {
      const strCPF = cpf.replace(/[^\d]+/g,'');
      let Soma;
      let Resto;
      Soma = 0;
      if (strCPF == '00000000000') {
        return false;
      }

      for (let i = 1; i <= 9; i++) {
        Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
      }

      Resto = (Soma * 10) % 11;

      if (Resto == 10 || Resto == 11) {
        Resto = 0;
      }
      if (Resto != parseInt(strCPF.substring(9, 10))) {
        return false;
      }

      Soma = 0;
      for (let i = 1; i <= 10; i++) {
        Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
      }
      Resto = (Soma * 10) % 11;

      if (Resto == 10 || Resto == 11) {
        Resto = 0;
      }
      if (Resto != parseInt(strCPF.substring(10, 11))) {
        return false;
      }
      return true;
    },
  },
};
</script>
