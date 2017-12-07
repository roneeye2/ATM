using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inncrewin.ATM.Application
{
    public class Withdraw : IWithdrow
    {
        private const int MinWithdraw = 1;
        private const int MaxWithdraw = 10000;
        private readonly IEnumerable<BankNote.IBankNote> _availableNote;

        public Withdraw(IEnumerable<BankNote.IBankNote> notes)
        {
            _availableNote = notes;
        }

        public IEnumerable<KeyValuePair<BankNote.IBankNote, int>> Distribute(int amount)
        {
            if (amount < MinWithdraw || amount > MaxWithdraw)
                throw new Exception("Amout should be between min and max");

            foreach (var note in _availableNote.OrderByDescending(e => e.Amount))
            {
                int count = amount / note.Amount;
                amount = amount % note.Amount;
                if (count > 0)
                   yield return new KeyValuePair<BankNote.IBankNote, int>(note, count);
            }
        }

    }

   
}
