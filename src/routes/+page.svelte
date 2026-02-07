<script lang='ts'>
    import CapillaryAction from "$lib/components/CapillaryAction.svelte"
    import GameOfLife from "$lib/components/GameOfLife.svelte";
    import { Card, Navbar, NavBrand, NavLi, NavUl, NavHamburger } from "flowbite-svelte"
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900">
    <Navbar class="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700">
      <NavBrand href="/">
        <img src="/favicon.svg" class="me-3 h-6 sm:h-9" alt="Killian Logo" />
        <span class="self-center text-xl font-semibold whitespace-nowrap text-white">Killian Higgins</span>
      </NavBrand>
      <NavHamburger />
      <NavUl>
        <NavLi href="/" class="text-gray-300 hover:text-white">Home</NavLi>
      </NavUl>
    </Navbar>
    
    <div class="flex justify-center items-center pt-16 px-4">
        <Card class="bg-gray-900/80 backdrop-blur-sm border-gray-700 shadow-2xl max-w-2xl pb-6">
            <div class="text-center mt-6 mb-6">
                <h2 class="text-2xl font-bold text-white mb-2">Capillary Action</h2>
                <p class="text-gray-400 text-sm">Drag your mouse to add water and watch it flow</p>
            </div>
            <CapillaryAction />
        </Card>

        <Card class="bg-gray-900/80 backdrop-blur-sm border-gray-700 shadow-2xl max-w-2xl pb-6">
            <div class="text-center mt-6 mb-6">
                <h2 class="text-2xl font-bold text-white mb-2">Game Of Life</h2>
                <p class="text-gray-400 text-sm">Drag your mouse to add cells</p>
            </div>
            <GameOfLife />
        </Card>
    </div>
</div>
