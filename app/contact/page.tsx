import {
  Clock3,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export default function ContactPage() {
  return (
    <main>
      {/* HERO */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Contact
          </p>

          <h1 className="mt-3 text-4xl font-bold text-gray-900 md:text-5xl">
            Contact our admissions team
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
            Have questions about programs,
            eligibility, applications, or admission?
            Our team is here to help.
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-5">
          {/* CONTACT DETAILS */}
          <div className="space-y-4 lg:col-span-2">
            <ContactCard
              icon={<Mail className="h-5 w-5" />}
              title="Email"
              value="admissions@3vskool.example"
            />

            <ContactCard
              icon={<Phone className="h-5 w-5" />}
              title="Phone"
              value="+91 00000 00000"
            />

            <ContactCard
              icon={<MapPin className="h-5 w-5" />}
              title="Campus"
              value="Institution Address, Kerala, India"
            />

            <ContactCard
              icon={<Clock3 className="h-5 w-5" />}
              title="Office Hours"
              value="Monday – Saturday, 9:00 AM – 5:00 PM"
            />
          </div>

          {/* FORM */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 lg:col-span-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Send an Inquiry
            </p>

            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              How can we help you?
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Contact form submission will be connected
              to the admissions system later.
            </p>

            <form className="mt-8 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Full Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Subject
                </label>

                <select
                  id="subject"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option>
                    Admission Inquiry
                  </option>

                  <option>
                    Program Information
                  </option>

                  <option>
                    Application Support
                  </option>

                  <option>
                    Payment Support
                  </option>

                  <option>
                    Other
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  rows={6}
                  placeholder="Tell us how we can help..."
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="button"
                disabled
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white opacity-60"
              >
                Send Inquiry
              </button>

              <p className="text-xs text-gray-500">
                Online inquiry submission will be
                enabled later.
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

function ContactCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
          {icon}
        </div>

        <div>
          <p className="font-bold text-gray-900">
            {title}
          </p>

          <p className="mt-1 text-sm leading-6 text-gray-600">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}