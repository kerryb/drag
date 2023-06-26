defmodule DragWeb.HomeLive do
  use DragWeb, :live_view

  alias Phoenix.LiveView

  defmodule Card do
    @enforce_keys [:id]
    defstruct [:id]
  end

  @impl LiveView
  def mount(_params, _session, socket) do
    cards = Enum.into(1..4, %{}, &{&1, %Card{id: &1}})
    opponent_cards = Enum.into(5..8, %{}, &{&1, %Card{id: &1}})

    {:ok,
     assign(socket,
       cards_in_hand: cards,
       cards_on_table: [],
       opponent_cards_in_hand: opponent_cards,
       opponent_cards_on_table: []
     )}
  end

  @impl LiveView
  def handle_event("drop", %{"id" => id}, socket) do
    {card, cards} = Map.pop(socket.assigns.cards_in_hand, String.to_integer(id))
    id = socket.assigns.opponent_cards_in_hand |> Map.keys() |> Enum.random()
    {opponent_card, opponent_cards} = Map.pop(socket.assigns.opponent_cards_in_hand, id)

    {:noreply,
     socket
     |> assign(cards_in_hand: cards, opponent_cards_in_hand: opponent_cards)
     |> update(:cards_on_table, &[card | &1])
     |> update(:opponent_cards_on_table, &[opponent_card | &1])}
  end

  defp offset(0), do: "top-[10px] left-[10px]"
  defp offset(1), do: "top-[20px] left-[20px]"
  defp offset(2), do: "top-[30px] left-[30px]"
  defp offset(3), do: "top-[40px] left-[40px]"
end
