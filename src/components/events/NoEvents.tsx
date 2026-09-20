import { CalendarDays, Mail } from "lucide-react";

export default function NoEvents() {
  return (
    <section className="w-full px-6 py-16 md:px-10 md:py-24">
      <div
        className="
          mx-auto
          max-w-6xl
          rounded-2xl
          border
          border-[var(--event-border)]
          bg-white
          px-6
          py-14
          text-center
          md:px-12
          md:py-16
          lg:px-16
        "
      >
        {/* Empty state */}
        <div className="mx-auto max-w-2xl">
          <div
            className="
              mx-auto
              flex
              h-24
              w-24
              items-center
              justify-center
              rounded-full
              bg-[#F8EEDF]
            "
          >
            <CalendarDays
              className="h-9 w-9 text-[var(--event-accent-strong)]"
              strokeWidth={1.7}
            />
          </div>

          <h2
            className="
              mt-7
              font-serif
              text-3xl
              font-normal
              text-[var(--event-heading)]
              md:text-4xl
            "
          >
            New gatherings are on the way!
          </h2>

          <p className="mt-4 text-base text-[#716B75]">
            Check back soon for upcoming events.
          </p>
        </div>

        {/* Newsletter card */}
        <div
          className="
            mt-14
            rounded-xl
            border
            border-[var(--event-border)]
            bg-[#FBF8F4]
            px-6
            py-7
            text-left
            md:px-8
            md:py-8
          "
        >
          <div
            className="
              flex
              flex-col
              gap-8
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            {/* Message */}
            <div className="flex items-start gap-5">
              <div
                className="
                  flex
                  h-16
                  w-16
                  flex-shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#F8EEDF]
                "
              >
                <Mail
                  className="h-7 w-7 text-[var(--event-accent-strong)]"
                  strokeWidth={1.7}
                />
              </div>

              <div>
                <h3 className="font-serif text-xl text-[var(--event-heading)]">
                  Be the first to know
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-[#716B75]">
                  Join our community to get updates
                  <br className="hidden sm:block" />
                  and be notified when new events
                  <br className="hidden sm:block" />
                  are announced.
                </p>
              </div>
            </div>

            <a
              href="#newsletter"
              className="inline-flex min-h-14 w-full items-center justify-center rounded-md bg-[var(--event-accent-strong)] px-10 text-sm font-medium text-white transition-colors hover:bg-[#A7792D] sm:w-auto lg:flex-shrink-0"
            >
              Join the Circle
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
